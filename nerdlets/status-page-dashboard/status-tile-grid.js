import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import StatusPage from '../../components/status-page';
import {
  getUserTileOrder,
  saveUserTileOrder,
} from '../../utilities/nerdlet-storage';

const REFRESH_RATE = 60;

const SortableStatusTile = ({
  hostname,
  refreshRate,
  handleDeleteTileModal,
  editHostName,
  accountId,
  isDragDisabled,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: hostname.id, disabled: isDragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="status-page-grid-item">
      <StatusPage
        refreshRate={refreshRate}
        hostname={hostname}
        handleDeleteTileModal={handleDeleteTileModal}
        editHostName={editHostName}
        accountId={accountId}
        dragHandleListeners={isDragDisabled ? undefined : listeners}
        dragHandleAttributes={isDragDisabled ? undefined : attributes}
      />
    </div>
  );
};

SortableStatusTile.propTypes = {
  hostname: PropTypes.shape({ id: PropTypes.string }).isRequired,
  refreshRate: PropTypes.number,
  handleDeleteTileModal: PropTypes.func,
  editHostName: PropTypes.func,
  accountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isDragDisabled: PropTypes.bool,
};

const StatusTileGrid = ({
  hostNames,
  searchQuery,
  handleDeleteTileModal,
  editHostName,
  accountId,
}) => {
  const [tileOrder, setTileOrder] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const order = await getUserTileOrder();
      if (!cancelled && order) setTileOrder(order);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const orderedHostNames = useMemo(() => {
    if (!tileOrder) return hostNames;
    return hostNames.toSorted((a, b) => {
      const ai = tileOrder.indexOf(a.id);
      const bi = tileOrder.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [hostNames, tileOrder]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = useCallback(
    ({ active, over }) => {
      if (!over || active.id === over.id) return;
      const oldIndex = orderedHostNames.findIndex((h) => h.id === active.id);
      const newIndex = orderedHostNames.findIndex((h) => h.id === over.id);
      const newItems = arrayMove(orderedHostNames, oldIndex, newIndex);
      const newOrder = newItems.map((h) => h.id);
      setTileOrder(newOrder);
      saveUserTileOrder(newOrder);
    },
    [orderedHostNames]
  );

  const displayHostNames = searchQuery
    ? orderedHostNames.filter((hostname) => {
        const target = hostname.serviceName ?? hostname.hostName ?? '';
        return target.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : orderedHostNames;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={displayHostNames.map((h) => h.id)}
        strategy={rectSortingStrategy}
      >
        <div className="status-container">
          {displayHostNames.map((hostname) => (
            <SortableStatusTile
              key={hostname.id}
              hostname={hostname}
              refreshRate={REFRESH_RATE}
              handleDeleteTileModal={handleDeleteTileModal}
              editHostName={editHostName}
              accountId={accountId}
              isDragDisabled={!!searchQuery}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

StatusTileGrid.propTypes = {
  hostNames: PropTypes.array.isRequired,
  searchQuery: PropTypes.string,
  handleDeleteTileModal: PropTypes.func,
  editHostName: PropTypes.func,
  accountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default StatusTileGrid;
