import { NavLink } from '@mantine/core';
import { useState } from 'react';
import { TbChevronDown, TbChevronRight, TbEdit } from 'react-icons/tb';
import { Notebook, Page } from '../../Types';
import { useContextMenu } from 'mantine-contextmenu';
import { TbPlus } from 'react-icons/tb';
import { TbTrash } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import RenameModal from './RenameModal';

interface Props {
  notebooks: Notebook[];
  onPageSelect: (page: Page) => void;

  onContextAdd: (parent: Page | Notebook) => void;
  onContextDelete: (elementToDelete: Page | Notebook) => void;

  reloadData: () => void;
}

function NotebookPageSelection(props: Props) {
  const { t } = useTranslation();
  const { showContextMenu } = useContextMenu();
  const [active, setActive] = useState(-1);

  const [elementToRename, setElementToRename] = useState<
    Page | Notebook | null
  >(null);

  // Create navlink elements for each notebook and page. Recursively create subpages until a page has no subpage.
  function createPagesLinks(pages: Page[]) {
    return pages.map((page, index) => {
      return (
        <NavLink
          label={page.title}
          key={index}
          active={active === page.id}
          rightSection={
            page.subpages && page.subpages.length > 0 ? (
              active === page.id ? (
                <TbChevronDown size={16} />
              ) : (
                <TbChevronRight size={16} />
              )
            ) : null
          }
          onClick={() => {
            setActive(page.id);
            // If the page has no subpages, call the onPageSelect function immediately.
            if (!page.subpages || page.subpages.length === 0) {
              props.onPageSelect(page);
            } else {
              // If the page has subpages, expand/collapse the page.
              // If the page is clicked again, call the onPageSelect function.
              if (active === page.id) {
                props.onPageSelect(page);
              }
            }
          }}
          onContextMenu={showContextMenu([
            {
              key: 'add',
              icon: <TbPlus size={16} />,
              title: t('notebooksPage.contextMenu.addSubpage'),
              onClick: () => props.onContextAdd(page),
            },
            {
              key: 'rename',
              icon: <TbEdit size={16} />,
              title: t('settingsPage.noteAttributes.renameTitle'),
              onClick: () => {
                setElementToRename(page);
              },
            },
            {
              key: 'delete',
              color: 'red',
              title: t('notebooksPage.contextMenu.delete'),
              icon: <TbTrash size={16} />,
              onClick: () => props.onContextDelete(page),
            },
          ])}
        >
          {page.subpages &&
            page.subpages.length > 0 &&
            createPagesLinks(page.subpages)}
        </NavLink>
      );
    });
  }

  return (
    <>
      {props.notebooks.map((notebook, index) => (
        <NavLink
          label={
            notebook.isShared
              ? notebook.title + ` (${t('notebooksPage.shared')})`
              : notebook.title
          }
          key={index}
          rightSection={
            notebook.pages && notebook.pages.length > 0 ? (
              active === notebook.id ? (
                <TbChevronDown size={16} />
              ) : (
                <TbChevronRight size={16} />
              )
            ) : null
          }
          onContextMenu={showContextMenu([
            {
              key: 'add',
              icon: <TbPlus size={16} />,
              title: t('notebooksPage.contextMenu.addPage'),
              onClick: () => props.onContextAdd(notebook),
            },
            {
              key: 'rename',
              icon: <TbEdit size={16} />,
              title: t('settingsPage.noteAttributes.renameTitle'),
              onClick: () => {
                setElementToRename(notebook);
              },
            },
            {
              key: 'delete',
              color: 'red',
              title: t('notebooksPage.contextMenu.delete'),
              icon: <TbTrash size={16} />,
              onClick: () => props.onContextDelete(notebook),
            },
          ])}
        >
          {createPagesLinks(notebook.pages)}
        </NavLink>
      ))}

      {elementToRename && (
        <RenameModal
          opened={elementToRename !== null}
          onClose={() => setElementToRename(null)}
          onRename={() => {
            props.reloadData();
            setElementToRename(null);
          }}
          elementToRename={elementToRename}
        />
      )}
    </>
  );
}

export default NotebookPageSelection;
