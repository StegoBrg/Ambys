import { APIErrorResponse, APIIdentityError } from '../Types';
import axiosInstance from './axiosInstance';

const apiUrlBase = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL
  : '/api/';

function isIdentityError(error: unknown): error is APIIdentityError {
  return (
    Array.isArray(error) &&
    error.every(
      (err) =>
        typeof err.code === 'string' && typeof err.description === 'string'
    )
  );
}

function isErrorResponse(error: unknown): error is APIErrorResponse {
  if (
    !!error &&
    typeof error === 'object' &&
    'code' in error &&
    'description' in error
  ) {
    const err = error as Record<string, unknown>;
    return typeof err.code === 'string' && typeof err.description === 'string';
  }
  return false;
}

function createNoteConfigIfNeeded() {
  // Check if notesConfig is already created
  axiosInstance.get('NoteConfigurations').then((response) => {
    if (response.data.length === 0) {
      // Create default note config
      const defaultNoteConfig = {
        noteAttributes: [],
      };
      axiosInstance
        .post('NoteConfigurations', defaultNoteConfig)
        .catch((err) => {
          console.error('Error creating default note config:', err);
        });
    }
  });
}

export {
  apiUrlBase,
  isIdentityError,
  isErrorResponse,
  createNoteConfigIfNeeded,
};
