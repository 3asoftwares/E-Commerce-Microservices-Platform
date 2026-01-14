# 3A Softwares - Customer Support Application

A customer support ticketing system with admin access for managing support tickets.

## Technologies Used (Previously Unused)

This application utilizes technologies from Abhishek Jain's resume that were **NOT** used in the existing 3A Softwares projects:

| Technology | Usage in This App |
|------------|-------------------|
| JavaScript (ES6+) | Core application logic |
| HTML5 | Semantic markup structure |
| CSS3 | Custom styling |
| SCSS | Advanced styling with variables & mixins |
| Bootstrap 5 | UI framework & components |
| Material Icons | Icon library |
| Fetch API | API communication (ready for backend) |
| Debouncing | Search optimization |
| Throttling | Performance optimization |
| MVC Pattern | Application architecture |
| Singleton Pattern | State management |

## Features

### Admin Dashboard
- Overview statistics (Total, Open, In Progress, Resolved tickets)
- Recent tickets list
- Priority distribution chart
- Real-time updates

### Ticket Management
- Create new tickets
- View ticket details
- Edit existing tickets
- Delete tickets
- Mark tickets as resolved
- Filter by status, priority, category
- Search functionality

### User Management
- View support agents
- Add new users
- Assign tickets to agents

### Reports
- Resolution time metrics
- Customer satisfaction rate

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd E-Commerce-Support

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3004`

### Login Credentials (Demo)
- **Email:** admin@3asoftwares.com
- **Password:** admin123

## Project Structure

```
E-Commerce-Support/
├── index.html          # Main HTML file
├── package.json        # Project configuration
├── README.md           # Documentation
├── css/
│   └── main.css        # Compiled CSS
├── scss/
│   └── main.scss       # SCSS source
└── js/
    └── app.js          # JavaScript application
```

## Future Enhancements (Backend Integration)

The application is designed to work with a backend API. When ready:

1. Replace mock data with API calls using Fetch
2. Implement real authentication
3. Add WebSocket for real-time updates
4. Connect to MongoDB for data persistence

## Screenshots

### Login Page
- Clean, modern login interface
- Demo credentials displayed

### Dashboard
- Statistics cards with animations
- Recent tickets table
- Priority distribution chart

### Tickets List
- Filterable and searchable
- Bulk actions support
- Pagination ready

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - 3A Softwares
