import { useState } from 'react';
import GenerateReportModal from './GenerateReportModal';
import ReportViewer from './ReportViewer';
import { HealthReport } from './Types';

// Reports will be selectable like notebooks. Each report has a json object that represents the attributes etc and how to visualize them.
// The report will be generated (new every time) based on the selected attributes and visualizations.
function ReportsPage() {
  const [previewReport, setPreviewReport] = useState<
    HealthReport | undefined
  >();

  const [generateReportModalOpen, setGenerateReportModalOpen] = useState(true);

  return (
    <>
      <div>
        <h1>Reports Page</h1>
        <p>This is the reports page where you can view and manage reports.</p>
      </div>
      {
        <GenerateReportModal
          opened={generateReportModalOpen}
          onClose={() => setGenerateReportModalOpen(false)}
          onSave={(report) => {
            setPreviewReport(report);
          }}
        />
      }

      {previewReport && <ReportViewer healthReport={previewReport} />}
    </>
  );
}
export default ReportsPage;
