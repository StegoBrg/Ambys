import { useState } from 'react';
import GenerateReportModal from './GenerateReportModal';
import ReportViewer from './ReportViewer';
import { HealthReport } from './Types';
import ReportOverview from './ReportOverview';
import { ActionIcon, Box } from '@mantine/core';
import { IoAdd } from 'react-icons/io5';

function ReportsPage() {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [preview, setPreview] = useState(false);

  const [generateReportModalOpen, setGenerateReportModalOpen] = useState(false);

  return (
    <>
      {report === null && (
        <>
          <ReportOverview
            onClick={(report) => {
              setReport(report);
              setPreview(false);
            }}
          />
          <GenerateReportModal
            opened={generateReportModalOpen}
            onClose={() => setGenerateReportModalOpen(false)}
            onSave={(report) => {
              setReport(report);
              setPreview(true);
            }}
          />
          <ActionIcon
            aria-label='Create'
            color='blue'
            size='3.5rem'
            radius='xl'
            onClick={() => setGenerateReportModalOpen(true)}
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              outline: '2px solid black',
            }}
          >
            <IoAdd size='2rem' />
          </ActionIcon>
        </>
      )}

      {report && (
        <Box m={20}>
          <ReportViewer
            healthReport={report}
            onBack={() => setReport(null)}
            preview={preview}
          />
        </Box>
      )}
    </>
  );
}
export default ReportsPage;
