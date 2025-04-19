import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const DatabaseContext = createContext();

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [bloodStock, setBloodStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all collections
  useEffect(() => {
    const unsubscribeAppointments = onSnapshot(
      query(collection(db, 'appointments'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setAppointments(snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          status: doc.data().status || 'pending'
        })));
      },
      (error) => {
        setError(error.message);
      }
    );

    const unsubscribeEmergency = onSnapshot(
      query(collection(db, 'emergency_blood_requests'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setEmergencyRequests(snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          status: doc.data().status || 'pending'
        })));
      },
      (error) => {
        setError(error.message);
      }
    );

    const unsubscribeBloodStock = onSnapshot(
      query(collection(db, 'blood_stock')),
      (snapshot) => {
        setBloodStock(snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data()
        })));
      },
      (error) => {
        setError(error.message);
      }
    );

    setLoading(false);

    return () => {
      unsubscribeAppointments();
      unsubscribeEmergency();
      unsubscribeBloodStock();
    };
  }, []);

  // Update request status
  const updateRequestStatus = async (collectionName, docId, status) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, { status });
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete request
  const deleteRequest = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      setError(error.message);
    }
  };

  // Update blood stock
  const updateBloodStock = async (docId, data) => {
    try {
      const docRef = doc(db, 'blood_stock', docId);
      await updateDoc(docRef, data);
    } catch (error) {
      setError(error.message);
    }
  };

  const value = {
    appointments,
    emergencyRequests,
    bloodStock,
    loading,
    error,
    updateRequestStatus,
    deleteRequest,
    updateBloodStock
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}; 