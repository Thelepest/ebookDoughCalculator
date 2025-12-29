import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToEvents, createEvent } from '../../services/firestoreService';
import { subscribeToNotes } from '../../services/firestoreService';
import '../../App.css';
import './CalendarPage.css';

const CalendarPage = ({ lang }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [noteId, setNoteId] = useState('');

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToEvents(user.uid, setEvents);
    const unsubNotes = subscribeToNotes(user.uid, setNotes);
    return () => { unsub && unsub(); unsubNotes && unsubNotes(); };
  }, [user]);

  const handleCreate = async () => {
    if (!user || !title || !date) return;
    await createEvent(user.uid, { title, start: new Date(date), noteRef: noteId || null });
    setTitle(''); setDate(''); setNoteId('');
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Calendar</h2>
      <div className="content">
        <div className="event-editor">
          <input placeholder="Event title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          <select value={noteId} onChange={(e)=>setNoteId(e.target.value)}>
            <option value="">-- Link note (optional) --</option>
            {notes.map(n=> <option key={n.id} value={n.id}>{n.title || '(no title)'}</option>)}
          </select>
          <button className="pages-button" onClick={handleCreate}>Add Event</button>
        </div>

        <div className="events-list">
          {events.map(ev => (
            <div key={ev.id} className="event-item">
              <div className="event-title">{ev.title}</div>
              <div className="event-date">{ev.start?.toDate ? new Date(ev.start.toDate()).toLocaleString() : (ev.start && new Date(ev.start).toLocaleString())}</div>
              {ev.noteRef && <div className="event-note">Linked note id: {ev.noteRef}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
