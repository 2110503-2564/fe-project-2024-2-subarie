import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Tools | CEDT Rentals',
  description: 'Administrative tools for CEDT Rentals',
};

export default async function AdminToolsPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect if not logged in or not an admin
  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }
  
  return (
    <main className="py-10 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-medium mb-8 text-center">Admin Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create New Admin Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4 text-[#8A7D55]">Create New Admin</h2>
          <p className="text-gray-600 mb-4">Create a new administrator account with full system access.</p>
          <Link 
            href="/admin-tools/create-admin" 
            className="inline-block px-4 py-2 bg-[#8A7D55] text-white rounded-md hover:bg-[#766b48] transition-colors"
          >
            Manage Admins
          </Link>
        </div>

        {/* Create New User Panel */}
          <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4 text-[#8A7D55]">Manage Users</h2>
          <p className="text-gray-600 mb-4">Manage and monitor user accounts.</p>
          <Link 
            href="/admin-tools/create-admin" 
            className="inline-block px-4 py-2 bg-[#8A7D55] text-white rounded-md hover:bg-[#766b48] transition-colors"
          >
            Manage Admins
          </Link>
        </div>

        
        {/* Create New Car Provider Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4 text-[#8A7D55]">Create New Car Provider</h2>
          <p className="text-gray-600 mb-4">Add a new car provider or rental company to the system.</p>
          <Link 
            href="/admin-tools/car-providers" 
            className="inline-block px-4 py-2 bg-[#8A7D55] text-white rounded-md hover:bg-[#766b48] transition-colors"
          >
            Manage Providers
          </Link>
        </div>
        
        {/* Create New Car Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4 text-[#8A7D55]">Create New Car</h2>
          <p className="text-gray-600 mb-4">Add a new vehicle to the rental fleet.</p>
          <Link 
            href="/admin-tools/cars" 
            className="inline-block px-4 py-2 bg-[#8A7D55] text-white rounded-md hover:bg-[#766b48] transition-colors"
          >
            Manage Cars
          </Link>
        </div>
        
        {/* Admin View Any Booking Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-medium mb-4 text-[#8A7D55]">Manage Bookings</h2>
          <p className="text-gray-600 mb-4">Search and view comprehensive details about any booking in the system.</p>
          <div className="mb-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by booking ID, customer name, or car details..." 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7D55]"
              />
              <button className="absolute right-2 top-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          <Link 
            href="/admin-tools/all-bookings" 
            className="inline-block px-4 py-2 bg-[#8A7D55] text-white rounded-md hover:bg-[#766b48] transition-colors"
          >
            View All Bookings
          </Link>
        </div>
      </div>
    </main>
  );
}