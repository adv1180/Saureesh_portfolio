import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Data Engineer</h4>
                <h5>Eficens Systems · Hyderabad</h5>
              </div>
              <h3>2023–24</h3>
            </div>
            <p>
              Architected the backend of an advanced SIEM Tool with a GraphQL API. Built an automated log processing pipeline leveraging NLP and Autoencoders. Managed ELK Stack on AWS and created custom real-time Kibana dashboards, improving threat detection efficiency by 12%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Data Engineer Intern</h4>
                <h5>Eficens Systems · Hyderabad</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Built automated PySpark ETL pipelines for log ingestion. Refined backend API endpoints for multiple microservices in a distributed architecture and conducted tech analysis of market-leading SIEM tools.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>SDE Intern</h4>
                <h5>Bartronics India Limited</h5>
              </div>
              <h3>2022</h3>
            </div>
            <p>
              Implemented an AIDC system for Tata Motors, increasing data capture speed by 25%. Designed the backend for BikeWo's ERP in Python, reducing manual inventory efforts significantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
