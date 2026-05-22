import { Bell, Search, User, Calendar, MapPin, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useTrip } from '@/lib/trip-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function AppHeader() {
  const { state, stats } = useTrip();
  const [showAlerts, setShowAlerts] = useState(true);
  
  const hasAlerts = stats.hasOverdueActivities || stats.isBudgetWarning || stats.isBudgetCritical;
  const alertCount = (stats.hasOverdueActivities ? 1 : 0) + (stats.isBudgetWarning || stats.isBudgetCritical ? 1 : 0);
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Info */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">{state.trip.tripName}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {state.trip.destination || 'No destination set'}
              </span>
              {state.trip.startDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(state.trip.startDate)} - {formatDate(state.trip.endDate)}
                </span>
              )}
            </div>
          </div>
          
        </div>
        
        {/* Center: Search */}
        <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search activities, items, expenses..." 
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {hasAlerts && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {alertCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {stats.hasOverdueActivities && (
                <DropdownMenuItem className="flex items-start gap-3 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Overdue Activities</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.overdueActivities} {stats.overdueActivities === 1 ? 'activity is' : 'activities are'} past due
                    </p>
                  </div>
                </DropdownMenuItem>
              )}
              
              {stats.isBudgetCritical && (
                <DropdownMenuItem className="flex items-start gap-3 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Budget Exceeded!</p>
                    <p className="text-xs text-muted-foreground">
                      You&apos;ve spent {stats.budgetUsagePercentage}% of your budget
                    </p>
                  </div>
                </DropdownMenuItem>
              )}
              
              {stats.isBudgetWarning && !stats.isBudgetCritical && (
                <DropdownMenuItem className="flex items-start gap-3 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Budget Warning</p>
                    <p className="text-xs text-muted-foreground">
                      You&apos;ve used {stats.budgetUsagePercentage}% of your budget
                    </p>
                  </div>
                </DropdownMenuItem>
              )}
              
              {!hasAlerts && (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Export Trip Data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Alert Bar */}
      {showAlerts && hasAlerts && (
        <div className={cn(
          "flex items-center justify-between px-6 py-2 text-sm",
          stats.isBudgetCritical ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning-foreground"
        )}>
          <div className="flex items-center gap-4">
            {stats.isBudgetCritical ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span className="font-medium">
              {stats.isBudgetCritical 
                ? `Critical: Budget exceeded by ${stats.remainingBudget} VND!`
                : stats.isBudgetWarning 
                  ? `Warning: You've used ${stats.budgetUsagePercentage}% of your budget.`
                  : `${stats.overdueActivities} overdue ${stats.overdueActivities === 1 ? 'activity' : 'activities'} detected.`
              }
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-transparent"
            onClick={() => setShowAlerts(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </header>
  );
}
