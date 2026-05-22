import { cn } from '@/lib/utils'
import { useTrip } from '@/lib/trip-context'
import { 
  Plane, 
  Utensils, 
  Camera, 
  ShoppingBag, 
  Building, 
  MoreHorizontal,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  ChevronDown,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const categoryIcons = {
  TRANSPORT: Plane,
  FOOD: Utensils,
  SIGHTSEEING: Camera,
  SHOPPING: ShoppingBag,
  HOTEL: Building,
  OTHER: MoreHorizontal
};

const categoryColors = {
  TRANSPORT: 'bg-transport/10 text-transport border-transport/20',
  FOOD: 'bg-food/10 text-food border-food/20',
  SIGHTSEEING: 'bg-sightseeing/10 text-sightseeing border-sightseeing/20',
  SHOPPING: 'bg-shopping/10 text-shopping border-shopping/20',
  HOTEL: 'bg-hotel/10 text-hotel border-hotel/20',
  OTHER: 'bg-muted text-muted-foreground border-muted'
};

const priorityColors = {
  LOW: 'bg-priority-low/10 text-priority-low',
  MEDIUM: 'bg-priority-medium/10 text-priority-medium',
  HIGH: 'bg-priority-high/10 text-priority-high'
};

const statusColors = {
  PLANNED: 'bg-status-planned/10 text-status-planned',
  IN_PROGRESS: 'bg-status-in-progress/10 text-status-in-progress',
  DONE: 'bg-status-done/10 text-status-done'
};


export function ItineraryCard({ item, onEdit }) {
  const { state, dispatch } = useTrip();
  const isViewMode = state.viewMode === 'view';
  
  const Icon = categoryIcons[item.category];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const itemDateTime = item.startTime ? new Date(item.startTime) : null;
  const isOverdue = item.status === 'PLANNED' && itemDateTime && itemDateTime < today;
  

  const startDisplay = item.startTime 
    ? item.startTime.split('T')[1]?.substring(0, 5) 
    : 'No time';

  const endDisplay = item.endTime 
    ? item.endTime.split('T')[1]?.substring(0, 5) 
    : null;

  const displayTime = startDisplay + (endDisplay ? ' - ' + endDisplay : '');
  
  const handleStatusChange = (newStatus) => {
    dispatch({
      type: 'UPDATE_ITINERARY',
      payload: { ...item, status: newStatus }
    });
  };
  
  const handleDelete = () => {
    dispatch({ type: 'DELETE_ITINERARY', payload: item.id });
  };
  
  return (
    <div className={cn(
      "group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
      isOverdue 
        ? "bg-destructive/5 border-destructive/30 hover:border-destructive/50" 
        : item.status === 'DONE'
          ? "bg-success/5 border-success/20 hover:border-success/30 opacity-75"
          : item.status === 'IN_PROGRESS'
            ? "bg-warning/5 border-warning/20 hover:border-warning/30"
            : "bg-card border-border/50 hover:border-border hover:shadow-md"
    )}>
      {/* Category Icon */}
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-xl shrink-0 border",
        categoryColors[item.category]
      )}>
        <Icon className="w-6 h-6" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={cn(
                "font-semibold text-foreground truncate",
                item.status === 'DONE' && "line-through text-muted-foreground"
              )}>
                {item.activityTitle}
              </h3>
              {isOverdue && (
                <Badge variant="destructive" className="text-[10px] uppercase tracking-wider h-5">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {displayTime}
              </span>
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.location}</span>
              </span>
            </div>
            
            {/* Badges */}
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className={cn("text-xs", priorityColors[item.priority])}>
                {item.priority?.toLowerCase()}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", categoryColors[item.category])}>
                {item.category?.toLowerCase()}
              </Badge>
              
              {/* Status Dropdown */}
              {!isViewMode ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn("h-6 text-xs gap-1", statusColors[item.status])}
                    >
                      {item.status === 'DONE' && <Check className="w-3 h-3" />}
                      {item.status}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel className="text-xs">Change Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(['PLANNED', 'IN_PROGRESS', 'DONE']).map((status) => (
                      <DropdownMenuItem 
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={cn(item.status === status && "bg-muted")}
                      >
                        {status === 'DONE' && <Check className="w-4 h-4 mr-2" />}
                        {status?.toLowerCase()}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Badge variant="outline" className={cn("text-xs", statusColors[item.status])}>
                  {item.status === 'DONE' && <Check className="w-3 h-3 mr-1" />}
                  {item.status?.toLowerCase()}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Actions */}
          {!isViewMode && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onEdit(item)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
