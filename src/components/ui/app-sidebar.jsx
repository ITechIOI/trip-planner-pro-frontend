import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Wallet,
  Plane,
  Eye,
  Edit3,
  RotateCcw,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTrip } from '@/lib/local-trip-context'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/itinerary', label: 'Itinerary', icon: Calendar },
  { href: '/packing', label: 'Packing', icon: CheckSquare },
  { href: '/budget', label: 'Budget', icon: Wallet },
]

export function AppSidebar() {
  const { pathname } = useLocation()
  const { state, dispatch, canUndo, stats } = useTrip()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary/20">
            <Plane className="h-5 w-5 text-sidebar-primary" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold">Trip Planner Pro</h1>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {state.trip.tripName}
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            const linkContent = (
              <Link
                to={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    !isActive && 'transition-transform group-hover:scale-110',
                  )}
                />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                {!collapsed &&
                  item.href === '/' &&
                  (stats.hasOverdueActivities || stats.isBudgetCritical) && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                      !
                    </span>
                  )}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.href}>{linkContent}</div>
          })}
        </nav>

        {!collapsed && (
          <div className="mx-3 mb-3 rounded-xl bg-sidebar-accent/50 p-3">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-sidebar-foreground/70">Itinerary</span>
                <span className="font-semibold">{stats.itineraryCompletionPercentage}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-sidebar-border">
                <div
                  className="h-full rounded-full bg-sidebar-primary transition-all duration-500"
                  style={{ width: `${stats.itineraryCompletionPercentage}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-sidebar-foreground/70">Packing</span>
                <span className="font-semibold">{stats.packingCompletionPercentage}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-sidebar-border">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${stats.packingCompletionPercentage}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-sidebar-foreground/70">Budget</span>
                <span
                  className={cn(
                    'font-semibold',
                    stats.isBudgetCritical && 'text-destructive',
                    stats.isBudgetWarning && !stats.isBudgetCritical && 'text-warning',
                  )}
                >
                  {stats.budgetUsagePercentage}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-sidebar-border">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    stats.isBudgetCritical
                      ? 'bg-destructive'
                      : stats.isBudgetWarning
                        ? 'bg-warning'
                        : 'bg-sidebar-primary',
                  )}
                  style={{ width: `${Math.min(stats.budgetUsagePercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-lg transition-transform hover:scale-110"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>
    </TooltipProvider>
  )
}
