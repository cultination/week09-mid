import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { app } from '../services/firebaseConfig';
import { VStack, HStack, Box, FormControl, Input, Button } from '@chakra-ui/react';

export const fetchToDoItems = async () => {
  const db = getFirestore(app);
  const toDoCollection = collection(db, 'todoitems');

  try {
    const querySnapshot = await getDocs(toDoCollection);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return items;
  } catch (error) {
    console.error('Error fetching to-do items:', error);
    return [];
  }
};

function ToDoItems() {
  const [toDos, setToDos] = useState([]);
  const [newToDoDescription, setNewToDoDescription] = useState('');
  const [newToDoDueDate, setNewToDoDueDate] = useState('');
  const [newToDoPriority, setNewToDoPriority] = useState('');
  const [editToDo, setEditToDo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const toDoCollection = collection(db, 'todoitems');

      try {
        const querySnapshot = await getDocs(toDoCollection);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setToDos(items);
      } catch (error) {
        console.error('Error fetching to-do items:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateToDo = async () => {
    if (!newToDoDescription || !newToDoDueDate || !newToDoPriority) return;

    const db = getFirestore(app);
    const toDoCollection = collection(db, 'todoitems');

    try {
      const docRef = await addDoc(toDoCollection, {
        description: newToDoDescription,
        dueDate: newToDoDueDate,
        priority: newToDoPriority,
      });

      setToDos((prevToDos) => [
        ...prevToDos,
        {
          id: docRef.id,
          description: newToDoDescription,
          dueDate: newToDoDueDate,
          priority: newToDoPriority,
        },
      ]);

      setNewToDoDescription('');
      setNewToDoDueDate('');
      setNewToDoPriority('');
    } catch (error) {
      console.error('Error creating to-do item:', error);
    }
  };

  const handleEditToDo = async () => {
    if (!editToDo) return;

    const db = getFirestore(app);
    const toDoDoc = doc(db, 'todoitems', editToDo.id);

    try {
      await updateDoc(toDoDoc, {
        description: editToDo.description,
        dueDate: editToDo.dueDate,
        priority: editToDo.priority,
      });

      setEditToDo(null);
    } catch (error) {
      console.error('Error editing to-do item:', error);
    }
  };

  const handleDeleteToDo = async (toDo) => {
    const db = getFirestore(app);
    const toDoDoc = doc(db, 'todoitems', toDo.id);

    try {
      await deleteDoc(toDoDoc);

      setToDos((prevToDos) => prevToDos.filter((item) => item.id !== toDo.id));
    } catch (error) {
      console.error('Error deleting to-do item:', error);
    }
  };

  return (
    <VStack align="start" spacing={4}>
      <h2>To-Do Items</h2>
      <Box>
        {toDos.map((toDo) => (
          <Box key={toDo.id}>
            {editToDo === toDo ? (
              <VStack spacing={2}>
                <FormControl>
                  <Input
                    type="text"
                    value={editToDo.description}
                    onChange={(e) => setEditToDo({ ...editToDo, description: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="text"
                    value={editToDo.dueDate}
                    onChange={(e) => setEditToDo({ ...editToDo, dueDate: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="text"
                    value={editToDo.priority}
                    onChange={(e) => setEditToDo({ ...editToDo, priority: e.target.value })}
                  />
                </FormControl>
                <Button onClick={handleEditToDo}>Save</Button>
              </VStack>
            ) : (
              <VStack spacing={2}>
                <strong>{toDo.description}</strong>
                <p>Due Date: {toDo.dueDate}</p>
                <p>Priority: {toDo.priority}</p>
                <HStack spacing={2}>
                  <Button onClick={() => setEditToDo(toDo)}>Edit</Button>
                  <Button onClick={() => handleDeleteToDo(toDo)}>Delete</Button>
                </HStack>
              </VStack>
            )}
          </Box>
        ))}
      </Box>

      <VStack spacing={2}>
        <FormControl>
          <Input
            type="text"
            placeholder="Description"
            value={newToDoDescription}
            onChange={(e) => setNewToDoDescription(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Input
            type="text"
            placeholder="Due Date"
            value={newToDoDueDate}
            onChange={(e) => setNewToDoDueDate(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Input
            type="text"
            placeholder="Priority"
            value={newToDoPriority}
            onChange={(e) => setNewToDoPriority(e.target.value)}
          />
        </FormControl>
        <Button onClick={handleCreateToDo}>Create</Button>
      </VStack>
    </VStack>
  );
}

export default ToDoItems;
