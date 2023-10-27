import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import app from '../firebaseConfig';

function ToDoItems() {
  const [toDos, setToDos] = useState([]);
  const [newToDo, setNewToDo] = useState('');
  const [editToDo, setEditToDo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await app.firestore().collection('todos').get();
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setToDos(items);
      } catch (error) {
        console.error('Error fetching to-do items:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateToDo = async () => {
    try {
      if (newToDo) {
        await app.firestore().collection('todos').add({
          description: newToDo,
        });

        setNewToDo('');
      }
    } catch (error) {
      console.error('Error creating to-do item:', error);
    }
  };

  const handleEditToDo = async () => {
    if (editToDo) {
      try {
        // Update the description field in the local state
        setEditToDo({ ...editToDo, description: editToDo.description });

        await app.firestore().doc(`todos/${editToDo.id}`).update({
          description: editToDo.description, // Update Firestore with the local state
        });

        setEditToDo(null);
      } catch (error) {
        console.error('Error editing to-do item:', error);
      }
    }
  };

  const handleDeleteToDo = async (toDo) => {
    try {
      await app.firestore().doc(`todos/${toDo.id}`).delete();
      // Update the local state to remove the deleted item
      setToDos((prevToDos) => prevToDos.filter((item) => item.id !== toDo.id));
    } catch (error) {
      console.error('Error deleting to-do item:', error);
    }
  };

  return (
    <div>
      <h2>To-Do Items</h2>
      <ul>
        {toDos.map((toDo) => (
          <li key={toDo.id}>
            {editToDo === toDo ? (
              <div>
                <input
                  type="text"
                  value={editToDo.description}
                  onChange={(e) =>
                    setEditToDo({ ...editToDo, description: e.target.value })
                  }
                />
                <button onClick={handleEditToDo}>Save</button>
              </div>
            ) : (
              <div>
                {toDo.description}
                <button onClick={() => setEditToDo(toDo)}>Edit</button>
                <button onClick={() => handleDeleteToDo(toDo)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="New To-Do"
          value={newToDo}
          onChange={(e) => setNewToDo(e.target.value)}
        />
        <button onClick={handleCreateToDo}>Create</button>
      </div>
    </div>
  );
}

export default ToDoItems;
