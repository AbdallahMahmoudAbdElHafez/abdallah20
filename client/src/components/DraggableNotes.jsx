import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  TextField,
  Fab,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Note as NoteIcon,
} from '@mui/icons-material';
import axiosClient from '../api/axiosClient';

const DraggableNotes = ({ onClose }) => {
  const [notes, setNotes] = useState([]);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axiosClient.get('/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      const response = await axiosClient.post('/notes', {
        content: 'محتوى الملاحظة...',
        title: 'ملاحظة جديدة',
      });
      setNotes((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding note:', error);
      alert('خطأ في إضافة الملاحظة');
    } finally {
      setIsAdding(false);
    }
  };

  const updateNote = async (id, data) => {
    try {
      await axiosClient.put(`/notes/${id}`, data);
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...data } : n)));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('هل تريد حذف هذه الملاحظة؟')) return;
    try {
      await axiosClient.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Drag logic using transform for better performance
  const handleMouseDown = (e) => {
    const handle = e.target.closest('.drag-handle');
    if (handle) {
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      elementStartPos.current = { ...position };
      e.preventDefault();
    }
  };

  // Drag logic using requestAnimationFrame for extra smoothness
  const requestRef = useRef();
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      if (requestRef.current) return;
      
      requestRef.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;
        
        setPosition({
          x: elementStartPos.current.x + deltaX,
          y: elementStartPos.current.y + deltaY,
        });
        requestRef.current = null;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isDragging]);

  return (
    <Paper
      elevation={10}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 300,
        height: 450,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.1)',
        bgcolor: '#f8f9fa',
        transition: isDragging ? 'none' : 'transform 0.1s ease-out, box-shadow 0.3s',
        boxShadow: isDragging ? '0 20px 40px rgba(0,0,0,0.2)' : '0 10px 20px rgba(0,0,0,0.1)',
        direction: 'ltr', // Force LTR for the container's coordinate system
        '& > *': { direction: 'rtl' }, // Ensure children (content) stay RTL
      }}
    >
      {/* Header */}
      <Box
        className="drag-handle"
        onMouseDown={handleMouseDown}
        sx={{
          p: 1.5,
          bgcolor: '#1a237e',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <DragIcon sx={{ mr: 1, opacity: 0.8 }} />
        <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1rem' }}>
          الملاحظات
        </Typography>
        <IconButton size="small" color="inherit" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: '#fff',
        }}
      >
        {notes.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.3 }}>
            <NoteIcon sx={{ fontSize: 80, mb: 1 }} />
            <Typography variant="h6">لا توجد ملاحظات</Typography>
          </Box>
        ) : (
          notes.map((note) => (
            <Card
              key={note.id}
              sx={{
                bgcolor: note.color || '#fff9c4',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.05)',
                '&:hover': { boxShadow: '0 6px 12px rgba(0,0,0,0.1)' },
                transition: 'box-shadow 0.2s',
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1 } }}>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="العنوان"
                  value={note.title || ''}
                  onChange={(e) => updateNote(note.id, { title: e.target.value })}
                  InputProps={{ 
                    disableUnderline: true, 
                    sx: { fontWeight: 'bold', fontSize: '1rem', color: '#333' } 
                  }}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  multiline
                  variant="standard"
                  placeholder="محتوى الملاحظة..."
                  value={note.content}
                  onChange={(e) => updateNote(note.id, { content: e.target.value })}
                  InputProps={{ 
                    disableUnderline: true, 
                    sx: { fontSize: '0.95rem', color: '#555', lineHeight: 1.5 } 
                  }}
                />
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 0.5 }}>
                <IconButton size="small" onClick={() => deleteNote(note.id)} sx={{ color: 'rgba(0,0,0,0.4)', '&:hover': { color: 'error.main' } }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ))
        )}
      </Box>

      {/* Floating Action Button for Adding */}
      <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
        <Tooltip title="إضافة ملاحظة جديدة">
          <Fab 
            color="primary" 
            size="medium" 
            onClick={addNote}
            disabled={isAdding}
            sx={{ boxShadow: '0 4px 10px rgba(26, 35, 126, 0.3)' }}
          >
            {isAdding ? <CircularProgress size={24} color="inherit" /> : <AddIcon />}
          </Fab>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default DraggableNotes;
