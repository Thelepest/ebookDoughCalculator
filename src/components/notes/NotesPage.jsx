import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToNotes, createNote } from '../../services/supabaseService';
import { uploadImageFile } from '../../services/storageService';
import '../../App.css';
import './NotesPage.css';

const NotesPage = ({ lang }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToNotes(user.uid, setNotes);
    return () => unsub && unsub();
  }, [user]);

  const handleCreate = async () => {
    if (!user) return;
    let attachment = null;
    if (file) {
      attachment = await uploadImageFile(user.uid, file);
    }
    await createNote(user.uid, { title, body, attachment });
    setTitle('');
    setBody('');
    setFile(null);
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Notes</h2>
      <div className="content">
        <div className="note-editor">
          <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <textarea placeholder="Write your note..." value={body} onChange={(e)=>setBody(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files[0])} />
          <div style={{display:'flex',gap:8}}>
            <button className="pages-button" onClick={handleCreate}>Save</button>
          </div>
        </div>

        <div className="notes-list">
          {notes.map(n=> (
            <div key={n.id} className="note-item">
              <h4>{n.title}</h4>
              <p>{n.body}</p>
              {n.attachment && <img src={n.attachment} alt="attachment" style={{maxWidth:'200px',borderRadius:8}}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
