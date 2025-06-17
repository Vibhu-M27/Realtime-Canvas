import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { updateCanvasState, subscribeToCanvas, createCanvas, firebaseEnabled } from '../firebase';

const CanvasContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #fafafa;
  position: relative;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
`;

const CanvasArea = styled.div`
  position: absolute;
  top: 0;
  left: ${({ $sidebarWidth, $sidebarVisible }) => ($sidebarVisible ? $sidebarWidth : 0)}px;
  right: 0;
  bottom: 0;
  background-color: #f0f0f0;
  cursor: grab;
  overflow: hidden;
  transition: left 0.3s ease-in-out;

  &:active {
    cursor: grabbing;
  }
`;

const WorldContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 0 0;
`;

const Sidebar = styled.div`
  position: fixed;
  left: ${props => props.$visible ? '0' : `-${props.$width}px`};
  top: 0;
  bottom: 0;
  width: ${props => props.$width}px;
  background: #2c3e50;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  padding: 12px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  border-right: 3px solid #3498db;
  transition: left 0.3s ease;
  scrollbar-width: thin;
  scrollbar-color: #3498db #2c3e50;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2c3e50;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #3498db;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #2980b9;
  }
  
  @media (max-width: 768px) {
    left: ${props => props.$visible ? '0' : '-100%'};
    width: ${props => Math.min(props.$width, 120)}px;
    z-index: 20;
    box-shadow: ${props => props.$visible ? '2px 0 15px rgba(0,0,0,0.3)' : 'none'};
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  right: -3px;
  top: 0;
  bottom: 0;
  width: 6px;
  cursor: col-resize;
  background: transparent;
  z-index: 15;
  
  &:hover {
    background: rgba(52, 152, 219, 0.3);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const StickerItem = styled.div`
  width: ${props => Math.max(60, Math.min(props.$sidebarWidth - 24, 80))}px;
  height: ${props => Math.max(60, Math.min(props.$sidebarWidth - 24, 80))}px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #3498db;
  margin: 0 auto 8px auto;
  flex-shrink: 0;
  
  &:active {
    cursor: grabbing;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  img {
    max-width: ${props => Math.max(50, Math.min(props.$sidebarWidth - 34, 70))}px;
    max-height: ${props => Math.max(50, Math.min(props.$sidebarWidth - 34, 70))}px;
    pointer-events: none;
  }
`;

const StickerWrapper = styled.div`
  position: absolute;
  user-select: none;
  cursor: ${props => props.locked ? 'default' : 'grab'};
  transform-origin: center;
  z-index: ${props => props.selected ? 10 : 1};
  transition: box-shadow 0.2s ease;
  opacity: ${props => props.locked ? 0.8 : 1};
  
  &:hover {
    box-shadow: ${props => props.locked ? 'none' : '0 0 10px rgba(0,0,0,0.2)'};
  }
  
  ${props => props.selected && !props.locked && `
    outline: 2px solid #2a9df4;
    box-shadow: 0 0 10px rgba(42,157,244,0.3);
  `}
  
  ${props => props.locked && `
    outline: 2px solid #e74c3c;
    box-shadow: 0 0 10px rgba(231,76,60,0.3);
  `}
`;

const StickerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`;

const UndoButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  
  &:hover {
    background: #c0392b;
  }
  
  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 12px;
    top: 15px;
    right: 15px;
  }
`;

const SidebarToggle = styled.button`
  position: fixed;
  top: 50%;
  left: ${props => props.$sidebarVisible ? `${props.$sidebarWidth + 10}px` : '10px'};
  transform: translateY(-50%);
  background: #3498db;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 25;
  transition: left 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  
  &:hover {
    background: #2980b9;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 18;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const StickerControls = styled.div`
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  background: white;
  padding: 4px 8px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 15;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const ResizeHandleSticker = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background: #2a9df4;
  border: 2px solid white;
  border-radius: 50%;
  cursor: nw-resize;
  z-index: 4;
  
  &.bottom-right {
    bottom: -6px;
    right: -6px;
    cursor: nw-resize;
  }
  
  &.top-left {
    top: -6px;
    left: -6px;
    cursor: nw-resize;
  }
  
  &.top-right {
    top: -6px;
    right: -6px;
    cursor: ne-resize;
  }
  
  &.bottom-left {
    bottom: -6px;
    left: -6px;
    cursor: ne-resize;
  }
`;

const RotateHandle = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: #e74c3c;
  border: 2px solid white;
  border-radius: 50%;
  cursor: grab;
  z-index: 4;
  bottom: -30px;
  left: calc(50% - 10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;

  &::after {
    content: '↻';
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const MiniMap = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 200px;
  height: 150px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #3498db;
  border-radius: 8px;
  z-index: 15;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    width: 160px;
    height: 120px;
    bottom: 15px;
    right: 15px;
  }
`;

const MiniMapCanvas = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #f8f9fa;
  overflow: hidden;
  cursor: pointer;
`;

const MiniMapSticker = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #3498db;
  border-radius: 50%;
  transform: translate(-50%, -50%);
`;

const MiniMapViewport = styled.div`
  position: absolute;
  border: 2px solid #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  pointer-events: none;
`;

const MiniMapButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: 8px;
  
  &:hover {
    background: #2980b9;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

export function Canvas({ stickers }) {
  console.log('Canvas component - Received stickers:', stickers);
  
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(120);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [miniMapVisible, setMiniMapVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Unified drag state ref to manage all pointer-based actions
  const dragState = useRef({
    action: 'none', // none, pan, drag_new, drag_existing, resize, rotate
  });

  // Refs for elements
  const canvasRef = useRef(null);
  const undoStackRef = useRef([]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && sidebarWidth > 120) {
        setSidebarWidth(100);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [sidebarWidth]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedId) {
          setSelectedId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  // Initialize canvas and set up real-time subscription
  useEffect(() => {
    let unsubscribe;

    const setupCanvas = async () => {
      try {
        const initialItems = await createCanvas('shared-canvas');
        setItems(initialItems);
        undoStackRef.current = [initialItems];
        
        unsubscribe = subscribeToCanvas('shared-canvas', (updatedItems) => {
          if (!isUpdating) {
            setItems(updatedItems);
          }
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Error setting up canvas:', error);
        setIsInitialized(true);
        undoStackRef.current = [[]];
      }
    };

    setupCanvas();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isUpdating]);

  // Update Firebase when items change
  useEffect(() => {
    if (!isInitialized) return;

    const updateStorage = async () => {
      try {
        setIsUpdating(true);
        await updateCanvasState('shared-canvas', items);
      } catch (error) {
        console.error('Error updating storage:', error);
      } finally {
        setIsUpdating(false);
      }
    };

    updateStorage();
  }, [items, isInitialized]);

  // Handle sidebar resize
  const handleSidebarResizeStart = (e) => {
    if (isMobile) return;
    
    e.preventDefault();
    setIsResizingSidebar(true);
    dragState.current = {
      action: 'resize',
      startX: e.clientX,
      startWidth: sidebarWidth
    };
  };

  useEffect(() => {
    const handleSidebarResize = (e) => {
      if (!isResizingSidebar) return;
      
      const deltaX = e.clientX - dragState.current.startX;
      const newWidth = Math.max(80, Math.min(300, dragState.current.startWidth + deltaX));
      setSidebarWidth(newWidth);
    };

    const handleSidebarResizeEnd = () => {
      setIsResizingSidebar(false);
    };

    if (isResizingSidebar) {
      document.addEventListener('mousemove', handleSidebarResize);
      document.addEventListener('mouseup', handleSidebarResizeEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleSidebarResize);
      document.removeEventListener('mouseup', handleSidebarResizeEnd);
    };
  }, [isResizingSidebar]);

  // Undo functionality
  const saveStateForUndo = () => {
    const currentState = JSON.parse(JSON.stringify(items));
    const newUndoStack = [...undoStackRef.current, currentState];
    if (newUndoStack.length > 20) {
      newUndoStack.shift();
    }
    undoStackRef.current = newUndoStack;
  };

  const handleUndo = () => {
    if (undoStackRef.current.length > 1) {
      const newUndoStack = [...undoStackRef.current];
      newUndoStack.pop(); // Remove current state
      const prevState = newUndoStack[newUndoStack.length - 1];
      undoStackRef.current = newUndoStack;
      setItems(prevState);
      setSelectedId(null);
    }
  };

  // Toggle lock for individual sticker
  const handleToggleLock = (id) => {
    saveStateForUndo();
    setItems(items.map(item =>
      item.id === id ? { ...item, locked: !item.locked } : item
    ));
    
    if (items.find(item => item.id === id && !item.locked)) {
      setSelectedId(null);
    }
  };

  const handlePointerDown = (e) => {
    if (e.button !== 0) return; // Only main button
    if (dragState.current.action !== 'none') return; // An action is already in progress

    e.preventDefault();
    dragState.current = {
      action: 'pan',
      x0: e.clientX,
      y0: e.clientY,
      ox: offset.x,
      oy: offset.y
    };
    setSelectedId(null);

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (dragState.current.action === 'none') return;
    e.preventDefault();

    switch (dragState.current.action) {
      case 'pan': {
        const { x0, y0, ox, oy } = dragState.current;
        const dx = e.clientX - x0;
        const dy = e.clientY - y0;
        setOffset({ x: ox + dx, y: oy + dy });
        break;
      }
      
      case 'drag_existing': {
        const { itemStartX, itemStartY, startX, startY, itemId } = dragState.current;
        const dx = (e.clientX - startX) / zoom;
        const dy = (e.clientY - startY) / zoom;
        
        setItems(prev => prev.map(item =>
          item.id === itemId
            ? { ...item, x: itemStartX + dx, y: itemStartY + dy }
            : item
        ));
        break;
      }

      case 'resize': {
        const { itemId, startScale, startDistance } = dragState.current;
        const rect = canvasRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentDistance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
        const scaleChange = currentDistance / startDistance;
        const newScale = Math.max(0.1, Math.min(3, startScale * scaleChange));
        
        setItems(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, scale: newScale }
            : item
        ));
        break;
      }

      case 'rotate': {
        const { itemId, startAngle, startRotation } = dragState.current;
        const itemElement = document.querySelector(`[data-sticker-id="${itemId}"]`);
        if (itemElement) {
          const itemRect = itemElement.getBoundingClientRect();
          const centerX = itemRect.left + itemRect.width / 2;
          const centerY = itemRect.top + itemRect.height / 2;
          const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
          const angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
          const newRotation = startRotation + angleDiff;
          
          setItems(prev => prev.map(item => 
            item.id === itemId
              ? { ...item, rotation: newRotation }
              : item
          ));
        }
        break;
      }
    }
  };

  const handlePointerUp = (e) => {
    if (dragState.current.action === 'drag_new') {
      const { stickerData } = dragState.current;
      const rect = canvasRef.current.getBoundingClientRect();
      
      // The stable, correct formula for dropping a new sticker
      const x = (e.clientX - rect.left - offset.x) / zoom;
      const y = (e.clientY - rect.top - offset.y) / zoom;
      
      const newSticker = {
        id: Date.now().toString(),
        type: 'sticker',
        x,
        y,
        scale: 1,
        rotation: 0,
        locked: false,
        data: stickerData
      };
      
      saveStateForUndo();
      setItems([...items, newSticker]);
      setSelectedId(newSticker.id);
      if (!isMobile) {
        setSidebarVisible(true);
      }
    }

    // Cleanup for all actions
    dragState.current = { action: 'none' };
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    const newZoom = Math.max(0.1, Math.min(5, zoom - delta * 0.001));
    setZoom(newZoom);
  };

  const handleStickerDragStart = (e, sticker) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragState.current = {
      action: 'drag_new',
      stickerData: sticker,
    };
    
    if (isMobile) {
        setSidebarVisible(false);
    }

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handleStickerPointerDown = (e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    
    const item = items.find(item => item.id === id);
    if (!item || item.locked) {
      dragState.current = { action: 'none' };
      return;
    }
    
    saveStateForUndo();
    dragState.current = {
      action: 'drag_existing',
      itemId: id,
      startX: e.clientX,
      startY: e.clientY,
      itemStartX: item.x,
      itemStartY: item.y
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handleResizeStart = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    
    const item = items.find(item => item.id === id);
    if (!item || item.locked) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
    
    dragState.current = {
      action: 'resize',
      itemId: id,
      startScale: item?.scale || 1,
      startDistance: distance,
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handleRotateStart = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    
    const item = items.find(item => item.id === id);
    if (!item || item.locked) return;
    
    const itemElement = document.querySelector(`[data-sticker-id="${id}"]`);
    const itemRect = itemElement.getBoundingClientRect();
    const centerX = itemRect.left + itemRect.width / 2;
    const centerY = itemRect.top + itemRect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    
    dragState.current = {
      action: 'rotate',
      itemId: id,
      startAngle: angle,
      startRotation: item?.rotation || 0,
    };
    
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handleDeleteSticker = (id) => {
    saveStateForUndo();
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    setSelectedId(null);
  };

  // Mini-map calculations - FINAL, ADAPTIVE VERSION
  const getMiniMapBounds = () => {
    // This function now dynamically calculates the bounds to include all items and the current viewport.
    
    // 1. Find bounding box of all items.
    let itemMinX = Infinity, itemMaxX = -Infinity, itemMinY = Infinity, itemMaxY = -Infinity;
    if (items.length > 0) {
      items.forEach(item => {
        itemMinX = Math.min(itemMinX, item.x);
        itemMaxX = Math.max(itemMaxX, item.x);
        itemMinY = Math.min(itemMinY, item.y);
        itemMaxY = Math.max(itemMaxY, item.y);
      });
    } else {
      // Default view if no items, centered at origin
      itemMinX = -500; itemMaxX = 500; itemMinY = -500; itemMaxY = 500;
    }

    // 2. Find bounding box of the user's current viewport.
    const canvasArea = canvasRef.current;
    if (!canvasArea) {
      return { minX: itemMinX, maxX: itemMaxX, minY: itemMinY, maxY: itemMaxY };
    }
    const visibleWidth = canvasArea.offsetWidth / zoom;
    const visibleHeight = canvasArea.offsetHeight / zoom;
    const viewMinX = -offset.x / zoom;
    const viewMaxX = viewMinX + visibleWidth;
    const viewMinY = -offset.y / zoom;
    const viewMaxY = viewMinY + visibleHeight;

    // 3. Combine the item and viewport bounding boxes.
    const combinedMinX = Math.min(itemMinX, viewMinX);
    const combinedMaxX = Math.max(itemMaxX, viewMaxX);
    const combinedMinY = Math.min(itemMinY, viewMinY);
    const combinedMaxY = Math.max(itemMaxY, viewMaxY);

    // 4. Add padding and ensure a minimum size for stability.
    const padding = 200;
    let finalMinX = combinedMinX - padding;
    let finalMaxX = combinedMaxX + padding;
    let finalMinY = combinedMinY - padding;
    let finalMaxY = combinedMaxY + padding;

    const minWorldSize = 1500;
    const worldWidth = finalMaxX - finalMinX;
    const worldHeight = finalMaxY - finalMinY;

    if (worldWidth < minWorldSize) {
      const expansion = (minWorldSize - worldWidth) / 2;
      finalMinX -= expansion;
      finalMaxX += expansion;
    }
    if (worldHeight < minWorldSize) {
      const expansion = (minWorldSize - worldHeight) / 2;
      finalMinY -= expansion;
      finalMaxY += expansion;
    }

    return { minX: finalMinX, maxX: finalMaxX, minY: finalMinY, maxY: finalMaxY };
  };

  const getMiniMapScale = () => {
    const bounds = getMiniMapBounds();
    const worldWidth = bounds.maxX - bounds.minX;
    const worldHeight = bounds.maxY - bounds.minY;
    const miniMapWidth = isMobile ? 160 : 200;
    const miniMapHeight = isMobile ? 120 : 150;
    
    return Math.min(miniMapWidth / worldWidth, miniMapHeight / worldHeight);
  };

  const worldToMiniMap = (worldX, worldY) => {
    const bounds = getMiniMapBounds();
    const scale = getMiniMapScale();
    const miniMapWidth = isMobile ? 160 : 200;
    const miniMapHeight = isMobile ? 120 : 150;
    
    // Center the world bounds in the mini map
    const worldCenterX = (bounds.minX + bounds.maxX) / 2;
    const worldCenterY = (bounds.minY + bounds.maxY) / 2;
    
    const miniMapX = miniMapWidth / 2 + (worldX - worldCenterX) * scale;
    const miniMapY = miniMapHeight / 2 + (worldY - worldCenterY) * scale;
    
    return { x: miniMapX, y: miniMapY };
  };

  const miniMapToWorld = (miniMapX, miniMapY) => {
    const bounds = getMiniMapBounds();
    const scale = getMiniMapScale();
    const miniMapWidth = isMobile ? 160 : 200;
    const miniMapHeight = isMobile ? 120 : 150;
    
    const worldCenterX = (bounds.minX + bounds.maxX) / 2;
    const worldCenterY = (bounds.minY + bounds.maxY) / 2;
    
    const worldX = worldCenterX + (miniMapX - miniMapWidth / 2) / scale;
    const worldY = worldCenterY + (miniMapY - miniMapHeight / 2) / scale;
    
    return { x: worldX, y: worldY };
  };

  const getMiniMapViewport = () => {
    const canvasArea = canvasRef.current;
    if (!canvasArea) return { x: 0, y: 0, width: 50, height: 50 };
    
    const actualWidth = canvasArea.offsetWidth;
    const actualHeight = canvasArea.offsetHeight;
    
    // Calculate the world coordinates of the current viewport corners
    const scale = getMiniMapScale();
    const visibleWidth = actualWidth / zoom;
    const visibleHeight = actualHeight / zoom;
    
    // Top-left corner of the viewport in world coordinates
    const topLeftWorldX = -offset.x / zoom;
    const topLeftWorldY = -offset.y / zoom;
    
    // Convert to mini map coordinates
    const topLeft = worldToMiniMap(topLeftWorldX, topLeftWorldY);
    
    return {
      x: topLeft.x,
      y: topLeft.y,
      width: visibleWidth * scale,
      height: visibleHeight * scale
    };
  };

  const handleMiniMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convert to world coordinates
    const worldPos = miniMapToWorld(clickX, clickY);
    
    // Center the view on the clicked point
    const canvasArea = canvasRef.current;
    if (!canvasArea) return;
    
    const newOffsetX = -worldPos.x * zoom;
    const newOffsetY = -worldPos.y * zoom;
    
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  return (
    <CanvasContainer>
      {/* Undo Button */}
      <UndoButton 
        onClick={handleUndo}
        disabled={undoStackRef.current.length <= 1}
      >
        <span>↶</span>
        Undo
      </UndoButton>

      {/* Mobile Backdrop */}
      {isMobile && (
        <MobileBackdrop 
          $visible={sidebarVisible}
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Mobile Sidebar Toggle */}
      {isMobile && (
        <SidebarToggle 
          $sidebarVisible={sidebarVisible}
          $sidebarWidth={sidebarWidth}
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          {sidebarVisible ? '✕' : '☰'}
        </SidebarToggle>
      )}

      {/* Debug Info */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: firebaseEnabled ? 'green' : 'orange',
        color: 'white',
        padding: '8px',
        borderRadius: '5px',
        zIndex: 1000,
        fontSize: '10px',
        maxWidth: '200px'
      }}>
        <div>Items: {items.length}</div>
        <div>Undo Stack: {undoStackRef.current.length}</div>
        <div>Firebase: {firebaseEnabled ? 'OK' : 'Error'}</div>
        <div>Offset: {Math.round(offset.x)}, {Math.round(offset.y)}</div>
        <div>Zoom: {zoom.toFixed(2)}</div>
        {items.length > 0 && (
          <div>Last Item: {Math.round(items[items.length-1]?.x || 0)}, {Math.round(items[items.length-1]?.y || 0)}</div>
        )}
      </div>
      
      <Sidebar
        $visible={sidebarVisible}
        $width={sidebarWidth}
      >
        <ResizeHandle onMouseDown={handleSidebarResizeStart} />
        {stickers && stickers.length > 0 ? (
          stickers.map((sticker) => (
            <StickerItem
              key={sticker.id}
              $sidebarWidth={sidebarWidth}
              onMouseDown={(e) => handleStickerDragStart(e, sticker)}
              onTouchStart={(e) => handleStickerDragStart(e, sticker)}
            >
              <img src={sticker.src} alt={sticker.alt} />
            </StickerItem>
          ))
        ) : (
          <div style={{ color: 'white', fontSize: '12px', textAlign: 'center' }}>
            No stickers
          </div>
        )}
        
        {/* Mini-map toggle button for mobile */}
        {isMobile && (
          <MiniMapButton onClick={() => setMiniMapVisible(!miniMapVisible)}>
            {miniMapVisible ? 'Hide Map' : 'Show Map'}
          </MiniMapButton>
        )}
      </Sidebar>
      
      <CanvasArea
        ref={canvasRef}
        $sidebarVisible={sidebarVisible}
        $sidebarWidth={sidebarWidth}
        onPointerDown={handlePointerDown}
        onWheel={handleWheel}
      >
        <WorldContainer
          style={{
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
          }}
        >
          {items.map((item) => {
            // Calculate zoom-responsive size (base size 60px, but adjusts with zoom)
            const baseSize = 60;
            const zoomAdjustedSize = baseSize / Math.sqrt(zoom); // Use square root for more natural scaling
            
            return (
              <StickerWrapper
                key={item.id}
                selected={selectedId === item.id}
                locked={item.locked}
                onPointerDown={(e) => handleStickerPointerDown(e, item.id)}
                data-sticker-id={item.id}
                style={{
                  left: item.x,
                  top: item.y,
                  transform: `scale(${item.scale || 1}) rotate(${item.rotation || 0}deg)`,
                  width: `${zoomAdjustedSize}px`,
                  height: `${zoomAdjustedSize}px`
                }}
              >
              <StickerImg src={item.data.src} alt={item.data.alt} />
              
              {selectedId === item.id && (
                <StickerControls>
                  <ControlButton 
                    onClick={() => handleToggleLock(item.id)}
                    title={item.locked ? "Unlock" : "Lock"}
                  >
                    {item.locked ? '🔓' : '🔒'}
                  </ControlButton>
                  
                  {!item.locked && (
                    <ControlButton 
                      onClick={() => handleDeleteSticker(item.id)} 
                      title="Delete"
                    >
                      🗑️
                    </ControlButton>
                  )}
                </StickerControls>
              )}

              {selectedId === item.id && !item.locked && (
                <>
                  <RotateHandle onPointerDown={(e) => handleRotateStart(e, item.id)} />
                  <ResizeHandleSticker 
                    className="top-left"
                    onPointerDown={(e) => handleResizeStart(e, item.id)}
                  />
                  <ResizeHandleSticker 
                    className="top-right"
                    onPointerDown={(e) => handleResizeStart(e, item.id)}
                  />
                  <ResizeHandleSticker 
                    className="bottom-left"
                    onPointerDown={(e) => handleResizeStart(e, item.id)}
                  />
                  <ResizeHandleSticker 
                    className="bottom-right"
                    onPointerDown={(e) => handleResizeStart(e, item.id)}
                  />
                </>
              )}
            </StickerWrapper>
          );
          })}
        </WorldContainer>
      </CanvasArea>
      
      {/* Mini Map */}
      {miniMapVisible && (
        <MiniMap>
          <MiniMapCanvas onClick={handleMiniMapClick}>
            {/* Show stickers as dots */}
            {items.map(item => {
              // Convert sticker world coordinates to mini map coordinates
              const miniMapPos = worldToMiniMap(item.x, item.y);
              
              return (
                <MiniMapSticker
                  key={item.id}
                  style={{
                    left: miniMapPos.x,
                    top: miniMapPos.y,
                  }}
                />
              );
            })}
            
            {/* Show viewport */}
            <MiniMapViewport
              style={{
                ...getMiniMapViewport(),
              }}
            />
          </MiniMapCanvas>
        </MiniMap>
      )}
    </CanvasContainer>
  );
} 