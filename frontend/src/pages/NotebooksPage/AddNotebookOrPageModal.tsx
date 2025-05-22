import { Button, Checkbox, Modal, Select, TextInput } from '@mantine/core';
import { Notebook, Page } from '../../Types';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axiosInstance';

interface Props {
  opened: boolean;
  notebookData: Notebook[];
  onClose: () => void;
  onAdd: () => void;

  // Used when adding a page through the context menu.
  parent: Page | Notebook | null;
}

const selectedElements = [
  { value: 'notebook', label: 'notebooksPage.addModal.notebook' },
  { value: 'page', label: 'notebooksPage.addModal.page' },
] as const;
type SelectedElements = (typeof selectedElements)[number]['value'];

function AddNotebookOrPageModal(props: Props) {
  const { t } = useTranslation();

  const [selectedElement, setSelectedElement] =
    useState<SelectedElements>('notebook');
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>(null);
  const [selectedParentPage, setSelectedParentPage] = useState<string | null>(
    null
  );
  const [name, setName] = useState('');
  // State to set when a notebook is shared. This is not used for pages.
  const [isShared, setIsShared] = useState(false);

  // Prefill values if parent is passed.
  useEffect(() => {
    if (props.parent !== null) {
      setSelectedElement('page');

      if ('content' in props.parent) {
        // props.parent is a page.
        const notebookId = props.parent.notebookId;
        const notebookName = props.notebookData.find(
          (value) => value.id === notebookId
        )?.title as string;
        setSelectedNotebook(notebookName);
        setSelectedParentPage(props.parent.title);
      } else {
        // props.parent is a notebook.
        setSelectedNotebook(props.parent.title);
      }
    }
  }, [props.notebookData, props.parent]);

  function cleanUp() {
    // Set all values to default.
    setSelectedElement('notebook');
    setSelectedNotebook(null);
    setSelectedParentPage(null);
    setName('');
  }

  function addNotebook() {
    const notebook: Notebook = {
      id: 0,
      title: name,
      pages: [],
      isShared: isShared,
    };

    axiosInstance
      .post<Notebook>('notebooks', notebook)
      .then(() => {
        props.onAdd();
        cleanUp();
      })
      .catch((err: AxiosError) => {
        notifications.show({
          title: t('notebooksPage.addModal.addErrorTitleNotebook'),
          message: (err.response?.data as string) ?? 'Unknown error',
          color: 'red',
          position: 'bottom-center',
        });
      });
  }

  function addPage() {
    const parentId = getPagesForNotebook(
      props.notebookData.find(
        (value) => value.title === selectedNotebook
      ) as Notebook
    ).find((value) => value.title === selectedParentPage)?.id;

    const page: Page = {
      id: 0,
      title: name,
      content: '',
      notebookId: props.notebookData.find(
        (value) => value.title === selectedNotebook
      )?.id as number,
      parentId: parentId ?? null,
      subpages: [],
    };

    axiosInstance
      .post<Page>('pages', page)
      .then(() => {
        props.onAdd();
        cleanUp();
      })
      .catch((err: AxiosError) => {
        notifications.show({
          title: t('notebooksPage.addModal.addErrorTitlePage'),
          message: (err.response?.data as string) ?? 'Unknown error',
          color: 'red',
          position: 'bottom-center',
        });
      });
  }

  function getPagesForNotebook(notebook: Notebook) {
    const allPages = [];

    for (let i = 0; i < notebook.pages.length; i++) {
      // Add first level pages.
      const page = notebook.pages[i];
      allPages.push(page);

      // Recursively add subpages.
      const allSubPages = getSubpagesForPageRecursive(page);
      allPages.push(...allSubPages);
    }

    return allPages;
  }

  function getSubpagesForPageRecursive(page: Page) {
    const allPages = [];

    if (page.subpages) {
      for (let i = 0; i < page.subpages.length; i++) {
        const subpage = page.subpages[i];
        allPages.push(subpage);

        if (subpage.subpages) {
          const subpages: Page[] = getSubpagesForPageRecursive(subpage);
          allPages.push(...subpages);
        }
      }
    }

    return allPages;
  }

  // Return true if the add button should be disabled.
  function checkAddButtonDisabled() {
    if (selectedElement === 'notebook') {
      return name === '';
    } else {
      return name === '' || selectedNotebook === null;
    }
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title={t('notebooksPage.addModal.modalTitle')}
      centered
    >
      <Select
        data={selectedElements.map((element) => ({
          value: element.value,
          label: t(`notebooksPage.addModal.${element.value}`),
        }))}
        value={selectedElement}
        onChange={(value) => {
          if (value !== null) {
            setSelectedElement(value as SelectedElements);
          }
        }}
        label={t('notebooksPage.addModal.selectElementLabel')}
        allowDeselect={false}
        withAsterisk
      />
      {selectedElement === 'page' && (
        <>
          <Select
            data={props.notebookData.map((value) => value.title)}
            label={t('notebooksPage.addModal.notebook')}
            withAsterisk
            value={selectedNotebook}
            onChange={(value) => setSelectedNotebook(value)}
          />
          <Select
            data={
              selectedNotebook
                ? getPagesForNotebook(
                    props.notebookData.find(
                      (value) => value.title === selectedNotebook
                    ) as Notebook
                  ).map((value) => value.title)
                : []
            }
            value={selectedParentPage}
            onChange={(value) => setSelectedParentPage(value)}
            label={t('notebooksPage.addModal.subpageOf')}
          />
        </>
      )}

      <TextInput
        label={t('notebooksPage.addModal.nameLabel')}
        placeholder={t('notebooksPage.addModal.namePlaceholder')}
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        withAsterisk
      />

      {selectedElement === 'notebook' && (
        <Checkbox
          mt='md'
          label={t('notebooksPage.shared')}
          checked={isShared}
          onChange={(e) => setIsShared(e.target.checked)}
        />
      )}

      <Button
        mt='md'
        onClick={() => {
          if (selectedElement === 'notebook') {
            addNotebook();
          } else {
            addPage();
          }
          props.onClose();
        }}
        disabled={checkAddButtonDisabled()}
      >
        {t('notebooksPage.addModal.addButton')}
      </Button>
    </Modal>
  );
}

export default AddNotebookOrPageModal;
