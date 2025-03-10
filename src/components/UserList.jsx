import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase/firebaseConfig";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users"); // 'users' is the Firestore collection name
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id} className="p-2 border-b">{user.name} - {user.email}</li>
          ))}
        </ul>
      ) : (
        <p>Loading users...</p>
      )}
    </div>
  );
};

export default UsersList;
