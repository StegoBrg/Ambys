import { ActionIcon, Box, Center } from '@mantine/core';
import NotebookPageSelection from './NotebookPageSelection';
import { IoAdd } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import AddNotebookOrPageModal from './AddNotebookOrPageModal';
import PageComponent from './PageComponent';
import { Notebook } from '../../Types';
import { Page } from '../../Types';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import axiosInstance from '../../lib/axiosInstance';

function NotebooksPage() {
  const [addElementModalOpen, setAddElementModalOpen] = useState(false);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);

  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [elementToDelete, setElementToDelete] = useState<
    Page | Notebook | null
  >(null);

  const [contextAddParent, setContextAddParent] = useState<
    Page | Notebook | null
  >(null);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    axiosInstance.get<Notebook[]>('notebooks').then((response) => {
      setNotebooks(response.data);
    });
  }

  function savePage(page: Page) {
    axiosInstance.put<Page>(`pages/${page.id}`, page).then(() => {
      getData();
    });
  }

  return (
    <>
      {selectedPage === null && (
        <>
          <Center>
            <Box w='80vw'>
              <NotebookPageSelection
                notebooks={notebooks}
                onPageSelect={(page) => {
                  setSelectedPage(page);
                }}
                onContextDelete={(elementToDelete) => {
                  setElementToDelete(elementToDelete);
                  setDeleteModalOpen(true);
                }}
                onContextAdd={(parent) => {
                  setContextAddParent(parent);
                  setAddElementModalOpen(true);
                }}
                reloadData={getData}
              />
            </Box>
          </Center>
          <ActionIcon
            aria-label='Create'
            color='blue'
            size='3.5rem'
            radius='xl'
            onClick={() => setAddElementModalOpen(true)}
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              outline: '2px solid black',
            }}
          >
            <IoAdd size='2rem' />
          </ActionIcon>
          <AddNotebookOrPageModal
            opened={addElementModalOpen}
            onClose={() => setAddElementModalOpen(false)}
            onAdd={() => getData()}
            notebookData={notebooks}
            parent={contextAddParent}
          />
        </>
      )}

      {selectedPage && (
        <Box m={10}>
          <PageComponent
            title={selectedPage?.title || ''}
            value={selectedPage?.content || ''}
            onChange={(e) => {
              const tempPage = selectedPage;
              tempPage.content = e;
              setSelectedPage(tempPage);
            }}
            onBackClick={() => {
              setSelectedPage(null);
              savePage(selectedPage);
            }}
            onDeleteClick={() => {
              setDeleteModalOpen(true);
              setElementToDelete(selectedPage);
            }}
          />
        </Box>
      )}

      {elementToDelete && (
        <DeleteConfirmationModal
          opened={deleteModalOpen}
          onClose={() => {
            setElementToDelete(null);
            setDeleteModalOpen(false);
          }}
          onDelete={() => {
            setElementToDelete(null);
            setSelectedPage(null);
            getData();
          }}
          elementToDelete={elementToDelete}
        />
      )}
    </>
  );
}

export default NotebooksPage;
