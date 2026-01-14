// Seed data for ticket service
// Run with: npx ts-node src/seeds/seedData.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { SupportUser, SupportUserRole, SupportUserStatus } from '../models/SupportUser';
import { Ticket, TicketCategory, TicketPriority, TicketStatus } from '../models/Ticket';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-storefront-tickets';

const supportUsers = [
  {
    email: 'admin@3asoftwares.com',
    password: 'admin123',
    name: 'Admin User',
    role: SupportUserRole.ADMIN,
    status: SupportUserStatus.ACTIVE,
    department: 'Administration',
  },
  {
    email: 'support1@3asoftwares.com',
    password: 'support123',
    name: 'Support Agent 1',
    role: SupportUserRole.AGENT,
    status: SupportUserStatus.ACTIVE,
    department: 'Technical Support',
  },
  {
    email: 'support2@3asoftwares.com',
    password: 'support123',
    name: 'Support Agent 2',
    role: SupportUserRole.AGENT,
    status: SupportUserStatus.ACTIVE,
    department: 'Billing Support',
  },
  {
    email: 'support3@3asoftwares.com',
    password: 'support123',
    name: 'Support Agent 3',
    role: SupportUserRole.AGENT,
    status: SupportUserStatus.ACTIVE,
    department: 'General Support',
  },
];

const tickets = [
  {
    subject: 'Unable to process payment',
    description: 'I tried to make a payment for my order but it keeps showing an error message. I have tried multiple cards but the issue persists.',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    category: TicketCategory.BILLING,
    priority: TicketPriority.HIGH,
    status: TicketStatus.OPEN,
  },
  {
    subject: 'Product not received',
    description: 'I ordered a laptop 10 days ago and it still has not arrived. The tracking shows it was delivered but I never received it.',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    category: TicketCategory.ORDER,
    priority: TicketPriority.HIGH,
    status: TicketStatus.IN_PROGRESS,
  },
  {
    subject: 'Request for refund',
    description: 'I would like to request a refund for my recent purchase. The product does not match the description on the website.',
    customerName: 'Mike Brown',
    customerEmail: 'mike.brown@email.com',
    category: TicketCategory.BILLING,
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.OPEN,
  },
  {
    subject: 'Login issues on mobile app',
    description: 'I cannot login to the mobile application. It keeps showing "Invalid credentials" even though I can login on the website.',
    customerName: 'Emily Davis',
    customerEmail: 'emily.d@email.com',
    category: TicketCategory.TECHNICAL,
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.IN_PROGRESS,
  },
  {
    subject: 'Feature request: Dark mode',
    description: 'It would be great if you could add a dark mode option to the application. It would help reduce eye strain during night time usage.',
    customerName: 'Alex Wilson',
    customerEmail: 'alex.w@email.com',
    category: TicketCategory.FEATURE,
    priority: TicketPriority.LOW,
    status: TicketStatus.RESOLVED,
  },
  {
    subject: 'Account verification pending',
    description: 'I submitted my documents for account verification 5 days ago but it is still showing as pending. Please expedite the process.',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.a@email.com',
    category: TicketCategory.ACCOUNT,
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.RESOLVED,
  },
  {
    subject: 'API integration help needed',
    description: 'We are trying to integrate your API into our system but facing issues with authentication. Can you provide technical support?',
    customerName: 'Tech Corp',
    customerEmail: 'support@techcorp.com',
    category: TicketCategory.TECHNICAL,
    priority: TicketPriority.HIGH,
    status: TicketStatus.OPEN,
  },
  {
    subject: 'Billing discrepancy',
    description: 'I was charged twice for my last order. Please investigate and process a refund for the duplicate charge.',
    customerName: 'Robert Taylor',
    customerEmail: 'robert.t@email.com',
    category: TicketCategory.BILLING,
    priority: TicketPriority.HIGH,
    status: TicketStatus.IN_PROGRESS,
  },
];

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await SupportUser.deleteMany({});
    await Ticket.deleteMany({});
    console.log('Cleared existing data');

    // Create support users
    const createdUsers = await SupportUser.insertMany(supportUsers);
    console.log(`Created ${createdUsers.length} support users`);

    // Create tickets with assignments
    for (let i = 0; i < tickets.length; i++) {
      const ticket = new Ticket(tickets[i]);
      
      // Assign some tickets to support users
      if (i < 4 && createdUsers[i % 3]) {
        ticket.assignedTo = createdUsers[i % 3]._id as any;
      }
      
      await ticket.save();
    }
    console.log(`Created ${tickets.length} tickets`);

    console.log('\nSeed data created successfully!');
    console.log('\nDefault Login Credentials:');
    console.log('Admin: admin@3asoftwares.com / admin123');
    console.log('Agent: support1@3asoftwares.com / support123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
