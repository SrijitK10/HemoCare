import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { sendStatusUpdateEmail } from '../firebase/notificationService';

const DatabaseContext = createContext();

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [bloodStock, setBloodStock] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [bloodDriveRequests, setBloodDriveRequests] = useState([]);
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

    const unsubscribeHelpRequests = onSnapshot(
      query(collection(db, 'helpRequests'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setHelpRequests(snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          status: doc.data().status || 'pending'
        })));
      },
      (error) => {
        setError(error.message);
      }
    );

    const unsubscribeBloodDriveRequests = onSnapshot(
      query(collection(db, 'blood_drive_requests'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setBloodDriveRequests(snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          status: doc.data().status || 'pending'
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
      unsubscribeHelpRequests();
      unsubscribeBloodDriveRequests();
    };
  }, []);

  // Update request status
  const updateRequestStatus = async (collectionName, docId, status) => {
    try {
      const docRef = doc(db, collectionName, docId);
      
      // First, get the current data to access contact information
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const requestData = docSnap.data();
        
        // Update status in Firestore
        await updateDoc(docRef, { status });
        
        // Only send notifications for approved or rejected status
        if (status === 'approved' || status === 'rejected') {
          // Extract relevant information for the notification
          const email = requestData.email;
          const name = requestData.name || requestData.patientName || 'Patient';
          const requestType = collectionName === 'appointments' ? 'appointment' : 'emergency';
          
          // Send email notification
          if (email) {
            try {
              await sendStatusUpdateEmail(
                email, 
                name, 
                requestType, 
                status, 
                {
                  id: docId,
                  date: requestData.date,
                  time: requestData.time,
                  bloodType: requestData.bloodType
                }
              );
            } catch (notificationError) {
              console.error('Failed to send notification:', notificationError);
              // Continue with the status update even if notification fails
            }
          }
        }
      }
    } catch (error) {
      setError(error.message);
      throw error;
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
    helpRequests,
    bloodDriveRequests,
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