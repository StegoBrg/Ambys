import ReportViewer from './ReportViewer';

// Reports will be selectable like notebooks. Each report has a json object that represents the attributes etc and how to visualize them.
// The report will be generated (new every time) based on the selected attributes and visualizations.
function ReportsPage() {
  return (
    <>
      <div>
        <h1>Reports Page</h1>
        <p>This is the reports page where you can view and manage reports.</p>
      </div>
      {/* <GenerateReportModal opened={true} onClose={() => {}} /> */}

      <ReportViewer />
    </>
  );
}
export default ReportsPage;
