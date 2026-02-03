import { supabase } from '../supabase';

// Notes table operations (per-user)
export const createNote = async (uid, note) => {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: uid,
      ...note,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
};

export const updateNote = async (uid, noteId, data) => {
  const { error } = await supabase
    .from('notes')
    .update({
      ...data,
      updatedat: new Date().toISOString(),
    })
    .eq('id', noteId)
    .eq('user_id', uid);

  if (error) throw error;
};

export const deleteNote = async (uid, noteId) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', uid);

  if (error) throw error;
};

export const subscribeToNotes = (uid, callback) => {
  const channel = supabase
    .channel('notes_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: `user_id=eq.${uid}`,
      },
      (payload) => {
        // Fetch all notes for the user after any change
        fetchNotes(uid).then(callback);
      }
    )
    .subscribe();

  // Initial fetch
  fetchNotes(uid).then(callback);

  return () => {
    supabase.removeChannel(channel);
  };
};

const fetchNotes = async (uid) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', uid)
    .order('createdat', { ascending: false });

  if (error) throw error;
  return data;
};

// Calendar events (per-user)
export const createEvent = async (uid, event) => {
  const { data, error } = await supabase
    .from('calendar_events')
    .insert({
      user_id: uid,
      ...event,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
};

export const subscribeToEvents = (uid, callback) => {
  const channel = supabase
    .channel('calendar_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'calendar_events',
        filter: `user_id=eq.${uid}`,
      },
      (payload) => {
        // Fetch all events for the user after any change
        fetchEvents(uid).then(callback);
      }
    )
    .subscribe();

  // Initial fetch
  fetchEvents(uid).then(callback);

  return () => {
    supabase.removeChannel(channel);
  };
};

const fetchEvents = async (uid) => {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', uid)
    .order('start', { ascending: true });

  if (error) throw error;
  return data;
};

// Admin messaging
export const sendAdminMessage = async (uid, payload) => {
  const { data, error } = await supabase
    .from('admin_messages')
    .insert({
      user_id: uid,
      ...payload,
      createdat: new Date().toISOString(),
      read: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
};

export const subscribeToAdminMessagesForUser = (uid, callback) => {
  const channel = supabase
    .channel('admin_messages_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'admin_messages',
        filter: `user_id=eq.${uid}`,
      },
      (payload) => {
        // Fetch all messages for the user after any change
        fetchAdminMessages(uid).then(callback);
      }
    )
    .subscribe();

  // Initial fetch
  fetchAdminMessages(uid).then(callback);

  return () => {
    supabase.removeChannel(channel);
  };
};

const fetchAdminMessages = async (uid) => {
  const { data, error } = await supabase
    .from('admin_messages')
    .select('*')
    .eq('user_id', uid)
    .order('createdat', { ascending: false });

  if (error) throw error;
  return data;
};

export const markAdminMessageRead = async (messageId) => {
  const { error } = await supabase
    .from('admin_messages')
    .update({ read: true })
    .eq('id', messageId);

  if (error) throw error;
};

// Generic user update
export const updateUser = async (uid, data) => {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', uid);

  if (error) throw error;
};

// Get user data
export const getUser = async (uid) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .maybeSingle();

  if (error) throw error;
  return data;
};
