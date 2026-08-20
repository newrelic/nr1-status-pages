import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Spinner } from 'nr1';

import Toolbar from '../../components/toolbar';
import useNerdStorageHostnames from '../../hooks/use-nerd-storage-hostnames';
import {
  getLastChosenAccountId,
  saveLastChosenAccountId,
} from '../../utilities/nerdlet-storage';

import CreateServiceModal from './create-service-modal';
import DeleteConfirmModal from './delete-confirm-modal';
import EmptyState from './empty-state';
import StatusTileGrid from './status-tile-grid';

const StatusPagesDashboard = ({ entityGuid }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(undefined);
  const [deleteTileModalActive, setDeleteTileModalActive] = useState(false);
  const [createTileModalActive, setCreateTileModalActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const tileToBeDeletedRef = useRef(undefined);

  const key = entityGuid || selectedAccountId;
  const type = entityGuid ? 'entity' : 'account';

  const { hostNames, setHostNames, loaded, save } = useNerdStorageHostnames({
    key,
    type,
  });

  const addHostName = useCallback(
    async (hostNameObject) => {
      const next = [...hostNames, hostNameObject];
      setHostNames(next);
      setCreateTileModalActive(false);
      await save(next);
    },
    [hostNames, setHostNames, save]
  );

  const deleteHostName = useCallback(async () => {
    const next = hostNames.filter((h) => h.id !== tileToBeDeletedRef.current);
    setHostNames(next);
    setDeleteTileModalActive(false);
    await save(next);
  }, [hostNames, setHostNames, save]);

  const editHostName = useCallback(
    async (hostnameObject) => {
      const next = hostNames.map((h) =>
        h.id === hostnameObject.id ? { ...hostnameObject } : h
      );
      setHostNames(next);
      await save(next);
    },
    [hostNames, setHostNames, save]
  );

  useEffect(() => {
    if (entityGuid) return undefined;
    let cancelled = false;
    (async () => {
      const data = await getLastChosenAccountId();
      if (!cancelled && data?.account) setSelectedAccountId(data.account);
    })();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onAccountSelected = useCallback(
    (_, accountId) => {
      if (!entityGuid) {
        setSelectedAccountId(accountId);
        saveLastChosenAccountId(accountId);
      }
    },
    [entityGuid]
  );

  const handleDeleteTileModal = useCallback((hostname) => {
    setDeleteTileModalActive((v) => !v);
    tileToBeDeletedRef.current = hostname.id;
  }, []);

  const handleCreateTileModal = useCallback(() => {
    setCreateTileModalActive((v) => !v);
  }, []);

  const setSearchQueryFromEvent = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const entityGuidExists = entityGuid !== null && entityGuid !== undefined;

  const renderContent = () => {
    if (!loaded && key) {
      return (
        <div className="status-container">
          <div
            style={{
              gridColumn: '1 / -1',
              height: '300px',
              position: 'relative',
            }}
          >
            <Spinner fillContainer />
          </div>
        </div>
      );
    }

    if (hostNames.length === 0) {
      return (
        <EmptyState
          entityGuidExists={entityGuidExists}
          selectedAccountId={selectedAccountId}
          onAccountSelected={onAccountSelected}
          onCreateClick={handleCreateTileModal}
        />
      );
    }

    return (
      <StatusTileGrid
        hostNames={hostNames}
        searchQuery={searchQuery}
        handleDeleteTileModal={handleDeleteTileModal}
        editHostName={editHostName}
        accountId={selectedAccountId}
      />
    );
  };

  return (
    <div className="dashboard-page-container">
      {hostNames.length > 0 && (
      <Toolbar
        entityGuid={entityGuid}
        onAccountSelected={onAccountSelected}
        selectedAccountId={selectedAccountId}
        handleCreateTileModal={handleCreateTileModal}
        setSearchQuery={setSearchQueryFromEvent}
      />
      )}
      <div className="dashboard-content">{renderContent()}</div>

      <DeleteConfirmModal
        hidden={!deleteTileModalActive}
        onCancel={() => setDeleteTileModalActive(false)}
        onConfirm={deleteHostName}
      />

      <CreateServiceModal
        hidden={!createTileModalActive}
        onClose={() => setCreateTileModalActive(false)}
        onAdd={addHostName}
      />
    </div>
  );
};

StatusPagesDashboard.propTypes = {
  entityGuid: PropTypes.string,
};

export default StatusPagesDashboard;
