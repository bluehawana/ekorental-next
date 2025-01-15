'use client'; // This component uses client-side functionality

import { useState, useEffect } from 'react';

interface User {
    id: number;
    username: string;
    email: string;
    phonenumber: string; // Assuming you have these fields
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<{ username: string; email: string; phonenumber: string }>({
        username: '',
        email: '',
        phonenumber: '',
    });

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:8085/api/users'); // Updated URL
            const data = await response.json();
            setUsers(data);
        };

        fetchUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8085/api/users', { // Updated URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });
        if (response.ok) {
            const addedUser = await response.json();
            setUsers([...users, addedUser]);
            setNewUser({ username: '', email: '', phonenumber: '' }); // Reset form
        }
    };

    const handleDeleteUser = async (id: number) => {
        const response = await fetch(`http://localhost:8085/api/users/${id}`, { // Updated URL
            method: 'DELETE',
        });
        if (response.ok) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    return (
        <div>
            <h1>Admin Users Management</h1>
            <form onSubmit={handleAddUser} className="mb-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={newUser.phonenumber}
                    onChange={(e) => setNewUser({ ...newUser, phonenumber: e.target.value })}
                    required
                />
                <button type="submit">Add User</button>
            </form>

            <h2>Existing Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.email} - {user.phonenumber}
                        <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
