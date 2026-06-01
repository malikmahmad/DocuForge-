import { ProjectDetails } from "../types";

export async function generateDocumentation(details: ProjectDetails): Promise<string> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to generate documentation. Please check your connection.");
  }

  const data = await response.json();
  return data.content || "";
}

function generateTemplateDocumentation(details: ProjectDetails): string {
  const { title, scale, customHeadings, structureMode } = details;
  const date = new Date().toLocaleDateString();
  const docId = `DF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const isCampusEvent = (title.toLowerCase().includes("campus") || title.toLowerCase().includes("event")) && !title.toLowerCase().includes("library") && !title.toLowerCase().includes("attendance");
  const isLibrary = title.toLowerCase().includes("library");
  const isEcommerce = title.toLowerCase().includes("e-commerce") || title.toLowerCase().includes("shop") || title.toLowerCase().includes("store");
  const isAttendance = details.projectType === "attendance" || title.toLowerCase().includes("attendance");

  let content = "";

  // 1. Cover Page
  content += `# ${title}\n`;
  content += `## Technical Specification & System Design Document\n\n`;
  content += `**Version:** 1.0.0  \n`;
  content += `**Author:** DocuForge Senior Architect Engine  \n`;
  content += `**Date:** ${date}  \n`;
  content += `**Document ID:** ${docId}  \n\n`;
  content += `**Confidentiality Notice:** This document contains proprietary and confidential information. All data submitted is provided in reliance upon its consent not to use or disclose any information contained herein except in the context of its business relationship with the project stakeholders.\n\n`;
  content += `\n---\n\n`;

  // 2. Table of Contents
  content += `# Table of Contents\n\n`;
  const defaultSections = [
    "Executive Summary",
    "Problem Statement",
    "Proposed Solution",
    "Functional Requirements",
    "Non-Functional Requirements",
    "System Architecture",
    "Data Flow",
    "Technology Stack",
    "Database Design",
    "API Design",
    "Implementation Methodology",
    "Testing Strategy",
    "Deployment Architecture",
    "Risk Assessment",
    "Performance & Scalability",
    "Monitoring & Logging",
    "Backup & Recovery Strategy",
    "Future Roadmap",
    "Conclusion"
  ];

  const headings = customHeadings?.trim() 
    ? customHeadings.split(/[,\n]/).map(h => h.trim()).filter(h => h)
    : defaultSections;

  headings.forEach((h, i) => {
    content += `${i + 1}. ${h}  \n`;
  });
  content += "\n---\n\n";

  if (customHeadings?.trim()) {
    headings.forEach((heading, index) => {
      content += `# ${index + 1}. ${heading}\n`;
      content += `Professional documentation content for **${heading}** based on the ${scale} scale project requirements. This section is generated in **${structureMode}** mode, ensuring strict adherence to the user-defined structure. The system architecture and implementation details for ${title} are meticulously outlined here to provide a comprehensive technical blueprint.\n\n`;
      content += `## ${index + 1}.1 Technical Specifications\nDetailed technical analysis and functional requirements for the ${heading} module, focusing on high-performance delivery and system integrity.\n\n`;
    });
    return content;
  }

  // 3. Executive Summary
  content += `# 1. Executive Summary\n\n`;
  content += `The **${title}** project represents a strategic digital transformation initiative designed to modernize the operational landscape of the target domain. This document serves as the definitive technical and functional blueprint, outlining a comprehensive strategy for development, deployment, and long-term scalability. \n\n`;
  
  if (isLibrary) {
    content += `In the context of modern information management, the need for an automated, efficient, and user-centric library platform is paramount. This system is engineered to transition traditional library operations into a digital-first ecosystem, streamlining book cataloging, member management, and circulation workflows. By leveraging a high-performance architecture, the system aims to eliminate manual record-keeping errors, reduce wait times for book issuance, and provide real-time visibility into inventory status for both librarians and students.\n\n`;
  } else if (isEcommerce) {
    content += `In the rapidly evolving digital marketplace, the **${title}** initiative aims to deliver a high-performance, scalable e-commerce ecosystem. This platform is engineered to provide a seamless shopping experience, integrating advanced product discovery, secure transaction processing, and robust order management. By utilizing a modern microservices-ready architecture, the system ensures high availability and sub-second response times for a global customer base.\n\n`;
  } else if (isAttendance) {
    content += `The **${title}** project is a specialized digital solution designed to modernize student attendance tracking. By replacing manual, paper-based systems with a centralized digital platform, the system ensures high accuracy, real-time visibility, and automated reporting. This initiative aims to streamline administrative workflows for teachers while providing students and parents with transparent access to attendance records.\n\n`;
  } else if (isCampusEvent) {
    content += `In the context of a modern academic environment, the need for a centralized, efficient, and user-friendly event management platform has never been more critical. This system is engineered to bridge the gap between event organizers (faculty/staff) and participants (students), providing a seamless end-to-end journey from event discovery to post-event feedback. By leveraging a high-performance 3-tier architecture and industry-leading technologies, the system aims to deliver sub-second response times, 99.9% availability, and a seamless user experience tailored for ${scale}-level operations.\n\n`;
  } else {
    content += `The **${title}** system is designed to address complex operational challenges through a robust, scalable, and user-centric digital platform. By consolidating core business processes into a unified ecosystem, the project aims to enhance efficiency, improve data integrity, and provide actionable insights for stakeholders. The architecture is built on industry-leading standards to ensure long-term sustainability and ease of integration with existing infrastructure.\n\n`;
  }

  // 4. Problem Statement
  content += `# 2. Problem Statement\n\n`;
  content += `The current environment is characterized by significant inefficiencies and technical limitations that hinder productivity and growth. `;
  
  if (isLibrary) {
    content += `Currently, library management relies on fragmented manual logs, outdated desktop applications, or physical card catalogs. Key challenges include:\n\n`;
    content += `- **Inventory Inaccuracy:** Difficulty in maintaining a real-time source of truth for book availability, leading to lost assets and frustrated users.\n`;
    content += `- **Circulation Bottlenecks:** Manual processes for issuing and returning books are slow, error-prone, and create long queues during peak hours.\n`;
    content += `- **Fine Management Inconsistency:** Lack of automated calculation and tracking for overdue fines results in lost revenue and unfair enforcement.\n`;
    content += `- **Search Inefficiency:** Users struggle to locate specific titles or authors without a centralized, searchable digital catalog.\n`;
    content += `- **Lack of Data Insights:** Librarians lack immediate access to borrowing trends and popular categories, preventing data-driven collection development.\n\n`;
  } else if (isEcommerce) {
    content += `The existing retail infrastructure faces challenges in meeting the demands of modern digital consumers. Key pain points include:\n\n`;
    content += `- **Conversion Friction:** Complex checkout processes and slow page loads leading to high cart abandonment rates.\n`;
    content += `- **Inventory Desynchronization:** Real-time stock levels are often inaccurate across different sales channels.\n`;
    content += `- **Scalability Issues:** System crashes during high-traffic sales events or seasonal peaks.\n`;
    content += `- **Limited Personalization:** Inability to provide tailored product recommendations based on user behavior.\n\n`;
  } else if (isAttendance) {
    content += `The current attendance management process is plagued by manual inefficiencies and lack of transparency. Key challenges include:\n\n`;
    content += `- **Manual Record-Keeping Errors:** Paper-based attendance logs are prone to human error, leading to inaccurate student records.\n`;
    content += `- **Lack of Real-time Visibility:** Administrators and parents cannot monitor student presence in real-time, delaying interventions for absenteeism.\n`;
    content += `- **Administrative Overhead:** Teachers spend significant class time manually marking attendance and compiling reports.\n`;
    content += `- **Data Fragmentation:** Attendance data is often siloed in physical registers, making long-term trend analysis difficult.\n\n`;
  } else if (isCampusEvent) {
    content += `Currently, event management on campus relies on fragmented communication channels, manual spreadsheets, and physical sign-up sheets. Key challenges include:\n\n`;
    content += `- **Data Fragmentation:** Critical information is siloed across multiple disconnected systems, making it difficult to maintain a single source of truth for event schedules and attendance.\n`;
    content += `- **Manual Bottlenecks:** High reliance on manual processes leads to increased error rates, operational delays, and significant administrative overhead for faculty and staff.\n`;
    content += `- **Scalability Constraints:** Existing infrastructure fails to maintain performance under peak load conditions, such as during major campus festivals or orientation weeks.\n`;
    content += `- **User Friction:** Outdated interfaces and complex registration flows result in low user engagement and high training costs for new users.\n`;
    content += `- **Lack of Real-time Insights:** Organizers lack immediate access to attendance data and feedback, preventing them from making data-driven decisions during or after events.\n\n`;
  } else {
    content += `The current operational model is hindered by several critical factors that limit the organization's ability to scale and innovate. Key challenges include:\n\n`;
    content += `- **Operational Inefficiency:** High reliance on manual data entry and fragmented workflows leads to increased overhead and error rates.\n`;
    content += `- **Data Silos:** Lack of a centralized repository makes it difficult to achieve a holistic view of system performance and user activity.\n`;
    content += `- **Technical Debt:** Legacy systems are difficult to maintain, lack modern security features, and are incompatible with new integration requirements.\n`;
    content += `- **User Experience Gaps:** Inconsistent interfaces and slow response times reduce user satisfaction and productivity.\n\n`;
  }

  // 5. Proposed Solution
  content += `# 3. Proposed Solution\n\n`;
  content += `The proposed solution for **${title}** is a modern, full-stack application built on a foundation of modularity and extensibility. The system consolidates core functionality into a unified platform, eliminating architectural complexity while providing the performance required for modern enterprise demands.\n\n`;
  
  if (isLibrary) {
    content += `By introducing a centralized digital ecosystem, the system will automate the entire library lifecycle. This includes sophisticated book cataloging, automated borrowing/return tracking, real-time availability status, and an integrated fine management system. The architecture is designed to be cloud-native, ensuring that it can scale dynamically based on the library's growing collection and user base.\n\n`;
  } else if (isEcommerce) {
    content += `The **${title}** platform provides a comprehensive digital storefront solution that automates product management, order fulfillment, and customer engagement. By utilizing a headless commerce approach, the system allows for maximum flexibility in the presentation layer while maintaining a robust and secure backend for transaction processing.\n\n`;
  } else if (isAttendance) {
    content += `The proposed solution provides a centralized digital platform for attendance management. It features a user-friendly interface for teachers to mark attendance, real-time dashboards for administrators, and automated reporting tools. The system ensures that attendance data is securely stored and easily accessible for audit and compliance purposes.\n\n`;
  } else if (isCampusEvent) {
    content += `By introducing a centralized digital ecosystem, the system will automate the entire event lifecycle. This includes sophisticated venue management, automated student registration, real-time attendance tracking via QR codes, and an integrated feedback loop. The architecture is designed to be cloud-native, ensuring that it can scale dynamically based on campus demand.\n\n`;
  } else {
    content += `The proposed system provides a centralized, high-performance platform that automates core workflows and provides a single source of truth for all system data. By leveraging a modern technology stack and a modular architecture, the solution ensures that the organization can adapt to changing requirements while maintaining high levels of security and performance.\n\n`;
  }

  content += `### 3.1 Key Features\n\n`;
  if (isLibrary) {
    content += `- **Advanced Book Search:** A powerful search engine allowing users to find books by title, author, ISBN, or category with real-time availability status.\n`;
    content += `- **Digital Circulation:** Automated issue and return tracking with barcode/QR integration for rapid processing.\n`;
    content += `- **Fine Management System:** Automated calculation of overdue fines and secure payment tracking for outstanding balances.\n`;
    content += `- **User Role Management:** Granular access control for Admins (system config), Librarians (inventory/circulation), and Students (search/borrowing).\n`;
    content += `- **Automated Reminders:** Intelligent notification system for upcoming due dates and overdue book alerts.\n\n`;
  } else if (isEcommerce) {
    content += `- **Dynamic Product Catalog:** Real-time inventory management with support for variants, categories, and advanced search filters.\n`;
    content += `- **Secure Checkout Engine:** Integrated payment gateway support with end-to-end encryption and PCI-DSS compliance.\n`;
    content += `- **Order Tracking System:** Real-time status updates for customers and an administrative dashboard for fulfillment management.\n`;
    content += `- **Customer Analytics:** Integrated reporting on sales trends, user behavior, and conversion metrics.\n`;
    content += `- **Responsive Storefront:** A mobile-first UI designed for high conversion across all device types.\n\n`;
  } else if (isAttendance) {
    content += `- **Digital Attendance Marking:** Quick and accurate attendance marking for teachers via web or mobile.\n`;
    content += `- **Real-time Dashboards:** Instant visibility into daily attendance trends and student presence.\n`;
    content += `- **Automated Reports:** Generation of comprehensive attendance summaries for compliance and analysis.\n`;
    content += `- **Role-Based Access:** Secure access for Admins, Teachers, Students, and Parents.\n`;
    content += `- **Attendance History:** Permanent logs of all attendance records for long-term tracking.\n\n`;
  } else if (isCampusEvent) {
    content += `- **Centralized Event Hub:** A unified portal for students to discover and register for campus activities, featuring advanced filtering by category, date, and department.\n`;
    content += `- **Automated Attendance:** QR-code based check-ins for seamless event tracking, integrated with mobile devices for rapid entry.\n`;
    content += `- **Smart Notifications:** Intelligent reminder system using push notifications and emails to boost student engagement and reduce no-show rates.\n`;
    content += `- **Analytics Dashboard:** Real-time insights for faculty to measure event success, including attendance heatmaps and feedback sentiment analysis.\n`;
    content += `- **Resource & Venue Management:** A robust scheduling engine that prevents double-bookings of campus facilities and manages equipment requests.\n\n`;
  } else {
    content += `- **Centralized Dashboard:** A unified interface for monitoring system health and managing core entities.\n`;
    content += `- **Automated Workflows:** Streamlined business logic execution to reduce manual intervention.\n`;
    content += `- **Real-time Data Sync:** Instant updates across all client instances using optimized protocols.\n`;
    content += `- **Advanced Reporting:** Customizable analytical reports with data visualization capabilities.\n`;
    content += `- **Robust Security:** Multi-layer security architecture including RBAC and data encryption.\n\n`;
  }

  // 6. Functional Requirements
  content += `# 4. Functional Requirements\n\n`;
  content += `The following table outlines the core functional requirements necessary for the successful implementation of the system. Each requirement is mapped to a priority level to guide the development phases.\n\n`;
  content += `| ID | Requirement | Description | Priority |\n`;
  content += `|:---|:---|:---|:---|\n`;
  if (isLibrary) {
    content += `| FR-01 | Book Inventory Mgmt | Librarians can add, update, and delete book records including title, author, and ISBN. | High |\n`;
    content += `| FR-02 | Issue/Return System | Process book issuance and returns with automated timestamping and availability updates. | High |\n`;
    content += `| FR-03 | Fine Calculation | Automatically calculate fines based on overdue days and library policy. | High |\n`;
    content += `| FR-04 | User Management | Admin can manage user accounts, assign roles (Librarian/Student), and track borrowing limits. | High |\n`;
    content += `| FR-05 | Search & Catalog | Students can search for books and view their current status (Available/Issued). | High |\n`;
    content += `| FR-06 | Borrowing History | Users can view their past and current borrowing records and outstanding fines. | Medium |\n`;
    content += `| FR-07 | Reservation System | Allow students to reserve books that are currently issued to other users. | Medium |\n`;
    content += `| FR-08 | Automated Alerts | Send email/SMS notifications for due date reminders and overdue alerts. | Medium |\n`;
  } else if (isEcommerce) {
    content += `| FR-01 | Product Management | Admin can manage product listings, pricing, and stock levels. | High |\n`;
    content += `| FR-02 | Shopping Cart | Users can add/remove items and manage quantities before checkout. | High |\n`;
    content += `| FR-03 | Payment Integration | Secure processing of transactions via third-party gateways. | High |\n`;
    content += `| FR-04 | Order Management | Track order status from placement to delivery with automated updates. | High |\n`;
    content += `| FR-05 | User Accounts | Customer registration, login, and order history tracking. | High |\n`;
    content += `| FR-06 | Search & Filter | Advanced product discovery based on categories, price, and attributes. | Medium |\n`;
  } else if (isAttendance) {
    content += `| FR-01 | Mark Attendance | Teachers can mark students as Present, Absent, or Late for specific classes. | High |\n`;
    content += `| FR-02 | View Attendance | Students and parents can view real-time attendance status and historical records. | High |\n`;
    content += `| FR-03 | Generate Reports | Administrators can generate automated attendance reports for compliance and analysis. | High |\n`;
    content += `| FR-04 | Manage Students & Classes | Admins can manage student enrollments, teacher assignments, and class schedules. | High |\n`;
    content += `| FR-05 | Attendance History | Maintain a permanent, immutable log of all attendance records for audit purposes. | High |\n`;
  } else if (isCampusEvent) {
    content += `| FR-01 | Student Registration | Allow students to sign up for events using university credentials with automated confirmation. | High |\n`;
    content += `| FR-02 | Event Creation | Faculty can create, edit, and manage event details, including multimedia assets and capacity limits. | High |\n`;
    content += `| FR-03 | Attendance Tracking | Generate and scan unique QR codes for student check-ins at event venues with real-time sync. | High |\n`;
    content += `| FR-04 | Feedback System | Automated post-event surveys to collect and analyze student feedback using Likert scales and text. | Medium |\n`;
    content += `| FR-05 | Resource Booking | Manage venue and equipment availability to prevent scheduling conflicts across the campus. | Medium |\n`;
    content += `| FR-06 | Notification Service | Push notifications and emails for event reminders, cancellations, and venue changes. | High |\n`;
    content += `| FR-07 | Certificate Generation | Automated generation of participation certificates in PDF format for verified attendees. | Low |\n`;
    content += `| FR-08 | User Profile Mgmt | Students can view their event history, registered events, and earned certificates. | Medium |\n`;
  } else {
    content += `| FR-01 | User Authentication | Secure login and session management for all user types. | High |\n`;
    content += `| FR-02 | Data Management | Comprehensive CRUD operations for core system entities. | High |\n`;
    content += `| FR-03 | Search & Retrieval | Efficient data discovery with advanced filtering capabilities. | High |\n`;
    content += `| FR-04 | Reporting Engine | Generation of detailed analytical reports in multiple formats. | Medium |\n`;
    content += `| FR-05 | Admin Controls | Centralized management of system settings and user permissions. | High |\n`;
  }
  content += `\n\n`;

  // 7. Non-Functional Requirements
  content += `# 5. Non-Functional Requirements\n\n`;
  content += `Non-functional requirements define the quality attributes and constraints of the system, ensuring it meets the performance and security standards required for a campus-wide deployment.\n\n`;
  content += `| Category | Requirement | Target Metric |\n`;
  content += `|:---|:---|:---|\n`;
  content += `| Performance | Latency | < 500ms for 95th percentile of all API requests under normal load. |\n`;
  content += `| Availability | Uptime | 99.9% annual availability with automated failover and multi-zone redundancy. |\n`;
  content += `| Security | Compliance | SOC2 / GDPR compliant data handling, TLS 1.3 encryption, and regular pen-testing. |\n`;
  content += `| Scalability | Throughput | Support for 10,000+ concurrent users and 1,000+ requests per second. |\n`;
  content += `| Reliability | Error Rate | < 0.1% failure rate for critical transaction paths (e.g., registration). |\n`;
  content += `| Usability | Accessibility | WCAG 2.1 Level AA compliance for all student-facing interfaces. |\n`;
  content += `\n\n`;

  // 8. System Architecture
  content += `# 6. System Architecture\n\n`;
  content += `### 6.1 Architectural Overview\n\n`;
  content += `The system utilizes a **3-Tier Decoupled Architecture** to ensure independent scalability and maintenance of the presentation, logic, and data layers. This separation allows for technology-specific optimizations at each level.\n\n`;
  content += `1. **Presentation Layer:** A high-performance React / TypeScript Single Page Application (SPA) that provides a rich, interactive user interface. It communicates with the backend via RESTful APIs and maintains local state for a fluid experience.\n`;
  content += `2. **Application Layer:** A robust Node.js / Express API server that handles business logic, authentication, and integration with third-party services. It is designed to be stateless to facilitate horizontal scaling.\n`;
  content += `3. **Data Layer:** A combination of PostgreSQL for relational data integrity and Redis for high-speed caching and session management. This ensures both data consistency and low-latency access to frequently used information.\n\n`;

  // 9. Data Flow
  content += `# 7. Data Flow\n\n`;
  content += `### 7.1 Core Transaction Flow\n\n`;
  content += `The following steps outline the lifecycle of a typical user request within the system:\n\n`;
  content += `1. **Ingress:** Client initiates a request via a secure HTTPS/TLS 1.3 connection through the Load Balancer.  \n`;
  content += `2. **Authentication:** API Gateway validates JWT tokens, checks RBAC permissions, and applies rate limiting.  \n`;
  content += `3. **Processing:** The Application Layer retrieves necessary context from the Cache Layer (Redis) or initiates a database transaction.  \n`;
  content += `4. **Persistence:** Business rules are applied, and state changes are committed to the Primary PostgreSQL Database.  \n`;
  content += `5. **Egress:** A structured JSON response is returned, and client-side views are updated atomically to reflect the new state.\n\n`;

  // 10. Technology Stack
  content += `# 8. Technology Stack\n\n`;
  content += `The technology stack has been selected based on performance, community support, and ease of integration.\n\n`;
  content += `| Category | Technology | Purpose |\n`;
  content += `|:---|:---|:---|\n`;
  content += `| Frontend | React 18, Tailwind CSS | Modern UI framework and utility-first styling for rapid development. |\n`;
  content += `| Backend | Node.js, Express | Event-driven, non-blocking I/O for scalable API services. |\n`;
  content += `| Database | PostgreSQL | Relational data integrity, ACID compliance, and complex querying. |\n`;
  content += `| Caching | Redis | In-memory data store for session management and response acceleration. |\n`;
  content += `| Infrastructure | Docker, Kubernetes | Containerization for environment parity and automated orchestration. |\n`;
  content += `| CI/CD | GitHub Actions | Automated build, test, and deployment pipelines for continuous delivery. |\n`;
  content += `| Monitoring | Prometheus, Grafana | Real-time metrics collection and visualization for system health. |\n`;
  content += `\n\n`;

  // 11. Database Design
  content += `# 9. Database Design\n\n`;
  content += `The database schema is designed to support complex relationships between users, books, and circulation records while maintaining high performance.\n\n`;
  content += `| Table | Fields | Description |\n`;
  content += `|:---|:---|:---|\n`;
  if (isLibrary) {
    content += `| Users | id (UUID), name, email, role (Admin/Librarian/Student) | User profiles and role-based access control. |\n`;
    content += `| Books | id (UUID), title, author, isbn, category, availability | Core book inventory and metadata. |\n`;
    content += `| BorrowRecords | id (UUID), user_id, book_id, issue_date, return_date | Tracking book circulation and due dates. |\n`;
    content += `| Fines | id (UUID), user_id, amount, status (Paid/Unpaid) | Automated fine tracking for overdue books. |\n`;
  } else if (isEcommerce) {
    content += `| Users | id (UUID), email, name, address, role | Customer and admin account data. |\n`;
    content += `| Products | id (UUID), name, description, price, stock_level | Product inventory and pricing details. |\n`;
    content += `| Orders | id (UUID), user_id, total_amount, status, created_at | Transaction records and fulfillment tracking. |\n`;
    content += `| OrderItems | id (UUID), order_id, product_id, quantity, price | Line items for each customer order. |\n`;
  } else if (isAttendance) {
    content += `| Students | id (UUID), name, class_id, enrollment_no | Core student profiles and academic identification. |\n`;
    content += `| Teachers | id (UUID), name, department, employee_id | Teacher profiles and departmental assignments. |\n`;
    content += `| Classes | id (UUID), subject, teacher_id, schedule | Class metadata and teacher-subject mapping. |\n`;
    content += `| Attendance | id (UUID), student_id, class_id, date, status | Real-time attendance logs (Present/Absent/Late). |\n`;
  } else if (isCampusEvent) {
    content += `| Users | id (UUID), email, name, role, student_id, dept | User profiles and university identity management. |\n`;
    content += `| Events | id (UUID), title, venue_id, date, capacity, status | Core event metadata, scheduling, and lifecycle state. |\n`;
    content += `| Registrations | id (UUID), user_id, event_id, status, checkin_time | Tracking student sign-ups and attendance verification. |\n`;
    content += `| Feedback | id (UUID), event_id, user_id, rating, comment | Post-event qualitative and quantitative data collection. |\n`;
    content += `| Venues | id (UUID), name, location, capacity, amenities | Physical locations available for events with capacity limits. |\n`;
    content += `| Resources | id (UUID), name, type, status | Equipment and assets that can be requested for events. |\n`;
  } else {
    content += `| Users | id (UUID), email, password_hash, role | User account and permission data. |\n`;
    content += `| Projects | id (UUID), user_id, title, content | Core business entity records. |\n`;
    content += `| AuditLogs | id (BIGINT), action, timestamp, user_id | Comprehensive system activity tracking for security. |\n`;
    content += `| Config | key (VARCHAR), value (JSONB) | Dynamic system configuration parameters. |\n`;
  }
  content += `\n\n`;

  // 12. API Design
  content += `# 10. API Design\n\n`;
  content += `The system exposes a versioned RESTful API to ensure backward compatibility and clear contract definitions.\n\n`;
  content += `| Method | Endpoint | Description | Status |\n`;
  content += `|:---|:---|:---|:---|\n`;
  if (isLibrary) {
    content += `| GET | /api/v1/books | Retrieve all books with search and availability filters. | 200 OK |\n`;
    content += `| POST | /api/v1/books | Add a new book to the inventory (Librarian only). | 201 Created |\n`;
    content += `| POST | /api/v1/borrow | Issue a book to a user and create a borrow record. | 201 Created |\n`;
    content += `| POST | /api/v1/return | Process a book return and calculate potential fines. | 200 OK |\n`;
    content += `| GET | /api/v1/users | List all users and their borrowing status (Admin only). | 200 OK |\n`;
    content += `| GET | /api/v1/fines | Retrieve outstanding fines for a specific user. | 200 OK |\n`;
  } else if (isEcommerce) {
    content += `| GET | /api/v1/products | Retrieve paginated product list with filters. | 200 OK |\n`;
    content += `| POST | /api/v1/orders | Place a new customer order. | 201 Created |\n`;
    content += `| GET | /api/v1/orders/:id | Retrieve detailed order status and history. | 200 OK |\n`;
    content += `| PUT | /api/v1/products/:id | Update product details or stock levels. | 200 OK |\n`;
  } else if (isAttendance) {
    content += `| POST | /api/v1/attendance/mark | Mark attendance for a specific class and student list. | 201 Created |\n`;
    content += `| GET | /api/v1/attendance | Retrieve attendance records with date and class filters. | 200 OK |\n`;
    content += `| GET | /api/v1/students | List all students enrolled in the system. | 200 OK |\n`;
    content += `| GET | /api/v1/classes | Retrieve class schedules and teacher assignments. | 200 OK |\n`;
  } else if (isCampusEvent) {
    content += `| GET | /api/v1/events | Retrieve all upcoming campus events with pagination and filters. | 200 OK |\n`;
    content += `| POST | /api/v1/events | Create a new event (Faculty/Staff only) with resource requests. | 201 Created |\n`;
    content += `| POST | /api/v1/register | Register a student for a specific event with validation. | 201 Created |\n`;
    content += `| GET | /api/v1/attendance | Fetch real-time attendance report for a specific event. | 200 OK |\n`;
    content += `| POST | /api/v1/feedback | Submit post-event student feedback and ratings. | 200 OK |\n`;
    content += `| GET | /api/v1/venues | List all available campus venues and their schedules. | 200 OK |\n`;
    content += `| DELETE | /api/v1/register/:id | Cancel an existing event registration. | 204 No Content |\n`;
  } else {
    content += `| GET | /api/v1/health | System health and dependency check. | 200 OK |\n`;
    content += `| POST | /api/v1/auth/login | Authenticate user and issue JWT. | 200 OK |\n`;
    content += `| GET | /api/v1/resources | Retrieve paginated resource list. | 200 OK |\n`;
    content += `| POST | /api/v1/resources | Create a new system resource. | 201 Created |\n`;
    content += `| PUT | /api/v1/resources/:id | Update existing resource metadata. | 200 OK |\n`;
  }
  content += `\n\n`;

  // 13. Implementation Methodology
  content += `# 11. Implementation Methodology\n\n`;
  content += `The project follows an **Agile Scrum** methodology with 2-week sprint cycles. This approach ensures continuous delivery of value, rapid feedback loops, and the ability to adapt to evolving requirements throughout the development lifecycle. Daily stand-ups, sprint planning, and retrospective meetings are conducted to maintain high team velocity and transparency.\n\n`;

  // 14. Testing Strategy
  content += `# 12. Testing Strategy\n\n`;
  content += `A multi-layered testing strategy is employed to ensure system reliability and security:\n\n`;
  content += `- **Unit Testing:** Comprehensive coverage of business logic and utility functions using Jest and Vitest.\n`;
  content += `- **Integration Testing:** Validation of API contracts, database interactions, and third-party service integrations.\n`;
  content += `- **E2E Testing:** Automated user journey validation using Cypress and Playwright to simulate real-world scenarios.\n`;
  content += `- **Load Testing:** Performance benchmarking under simulated peak traffic conditions using k6 to identify bottlenecks.\n`;
  content += `- **Security Testing:** Automated vulnerability scanning and manual penetration testing for OWASP Top 10 risks.\n\n`;

  // 15. Deployment Architecture
  content += `# 13. Deployment Architecture\n\n`;
  content += `The application is deployed using a **Blue-Green Deployment** strategy on a cloud-native infrastructure. Automated pipelines handle container builds and deployments to a managed Kubernetes cluster, ensuring zero-downtime updates and easy rollbacks. Traffic is managed via an Ingress Controller with SSL termination.\n\n`;

  // 16. Risk Assessment
  content += `# 14. Risk Assessment\n\n`;
  content += `The following table identifies potential risks and the corresponding mitigation strategies to ensure project continuity.\n\n`;
  content += `| Risk ID | Description | Probability | Impact | Mitigation Strategy |\n`;
  content += `|:---|:---|:---|:---|:---|\n`;
  content += `| R-01 | Data Security Breach | Low | Critical | Multi-layer encryption, RBAC, and regular security audits. |\n`;
  content += `| R-02 | System Latency | Medium | Medium | Horizontal scaling, Redis caching, and CDN integration. |\n`;
  content += `| R-03 | Third-party API Failure | Low | High | Circuit breaker patterns, fallback logic, and redundancy. |\n`;
  content += `| R-04 | Scope Creep | Medium | Medium | Strict Agile backlog management and MVP-first approach. |\n`;
  content += `| R-05 | Resource Conflict | Medium | Low | Automated venue booking validation and conflict detection. |\n`;
  content += `| R-06 | Low User Adoption | Low | Medium | User-centric design, pilot testing, and training sessions. |\n`;
  content += `\n\n`;

  // 17. Performance & Scalability
  content += `# 15. Performance & Scalability\n\n`;
  content += `The system is designed for horizontal scalability, allowing for the addition of application nodes in response to increased demand. Database performance is optimized through read-replicas, efficient indexing strategies, and connection pooling. Static assets are served via a global Content Delivery Network (CDN) to minimize latency for users across different campus locations.\n\n`;

  // 18. Monitoring & Logging
  content += `# 16. Monitoring & Logging\n\n`;
  content += `Full-stack observability is achieved through centralized logging and real-time metrics collection. Dashboards provide visibility into system health, performance bottlenecks, and user engagement metrics. Automated alerts are configured to notify the engineering team of any anomalies or service disruptions.\n\n`;

  // 19. Backup & Recovery Strategy
  content += `# 17. Backup & Recovery Strategy\n\n`;
  content += `Daily automated snapshots of all persistent data are performed and stored in geographically redundant locations. The system maintains a Recovery Point Objective (RPO) of 15 minutes and a Recovery Time Objective (RTO) of 4 hours, ensuring minimal data loss and rapid service restoration in the event of a disaster.\n\n`;

  // 20. Future Roadmap
  content += `# 18. Future Roadmap\n\n`;
  content += `The evolution of the system will focus on expanding capabilities and enhancing user experience:\n\n`;
  content += `- **Phase 1:** Core platform stabilization, initial user onboarding, and basic reporting.\n`;
  content += `- **Phase 2:** Advanced AI-driven predictive analytics for event attendance and resource optimization.\n`;
  content += `- **Phase 3:** Native mobile application development for iOS and Android to provide a better on-the-go experience.\n`;
  content += `- **Phase 4:** Integration with campus smart-card systems for physical access control and payments.\n\n`;

  // 21. Conclusion
  content += `# 19. Conclusion\n\n`;
  content += `This technical specification provides the definitive guide for the implementation of the **${title}**. By adhering to these architectural and functional guidelines, the project is positioned for long-term success, reliability, and scalability in a dynamic digital environment. The proposed solution addresses the identified challenges and provides a robust foundation for modern campus event management.\n\n`;

  return content;
}

