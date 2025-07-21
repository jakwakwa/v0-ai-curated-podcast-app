import { auth } from '@clerk/nextjs/server'
import { canManageTeamSettings, isOrgAdmin } from '@/lib/organization-roles'
import { redirect } from 'next/navigation'

export default async function TeamSettingsPage() {
  // Method 1: Using the auth() helper directly
  const { has } = await auth()

  // Check if the user is authorized using role
  const canManageByRole = has({ role: 'org:admin' })
  
  // Check if the user is authorized using permission
  const canManageByPermission = has({ permission: 'org:team_settings:manage' })

  // If user doesn't have the correct permissions, redirect or show access denied
  if (!canManageByRole && !canManageByPermission) {
    redirect('/unauthorized')
  }

  // Method 2: Using our utility functions (also works)
  const isAdmin = await isOrgAdmin()
  const canManage = await canManageTeamSettings()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Team Settings</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Access Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Role-based access:</p>
            <p className="text-sm text-gray-600">
              {canManageByRole ? '✅ Admin access granted' : '❌ Admin access required'}
            </p>
          </div>
          <div>
            <p className="font-medium">Permission-based access:</p>
            <p className="text-sm text-gray-600">
              {canManageByPermission ? '✅ Team settings permission granted' : '❌ Team settings permission required'}
            </p>
          </div>
          <div>
            <p className="font-medium">Is Organization Admin:</p>
            <p className="text-sm text-gray-600">
              {isAdmin ? '✅ Yes' : '❌ No'}
            </p>
          </div>
          <div>
            <p className="font-medium">Can Manage Team Settings:</p>
            <p className="text-sm text-gray-600">
              {canManage ? '✅ Yes' : '❌ No'}
            </p>
          </div>
        </div>
      </div>

      {/* Only show admin features if user has permission */}
      {(canManageByRole || canManageByPermission) && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Team Management</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Organization Settings</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Edit Organization Settings
              </button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Member Management</h3>
              <div className="space-x-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Invite Members
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                  Manage Roles
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Advanced Settings</h3>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Danger Zone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
