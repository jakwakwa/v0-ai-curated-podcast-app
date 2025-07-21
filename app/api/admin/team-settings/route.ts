import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { requireOrgPermission, requireOrgRole } from '@/lib/organization-roles'

// GET /api/admin/team-settings - Get team settings
export async function GET() {
  try {
    // Method 1: Using auth() directly
    const { has, userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role OR team settings permission
    const hasAdminRole = has({ role: 'org:admin' })
    const hasPermission = has({ permission: 'org:team_settings:read' })

    if (!hasAdminRole && !hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Your team settings logic here
    const teamSettings = {
      organizationName: 'My Organization',
      memberCount: 15,
      settings: {
        allowGuestAccess: false,
        requireTwoFactor: true,
      }
    }

    return NextResponse.json(teamSettings)
  } catch (error) {
    console.error('Error fetching team settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/team-settings - Update team settings
export async function PUT(request: NextRequest) {
  try {
    // Method 2: Using utility function with automatic error handling
    await requireOrgPermission('org:team_settings:manage')

    const body = await request.json()
    
    // Your update logic here
    console.log('Updating team settings:', body)

    return NextResponse.json({ success: true, message: 'Team settings updated' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('permission')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    console.error('Error updating team settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/team-settings - Delete team settings (admin only)
export async function DELETE() {
  try {
    // Require admin role specifically
    await requireOrgRole('org:admin')

    // Your deletion logic here
    console.log('Deleting team settings (admin only action)')

    return NextResponse.json({ success: true, message: 'Team settings deleted' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('role')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    
    console.error('Error deleting team settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
