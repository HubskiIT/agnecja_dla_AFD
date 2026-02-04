"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    parseISO
} from "date-fns";
import { supabase } from "@/lib/supabase";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ChevronLeft, ChevronRight, GripVertical, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import clsx from "clsx";

// --- Components ---

function DraggableEvent({ event, isOverlay = false }: { event: any, isOverlay?: boolean }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: event.id,
        data: { event }
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    const statusColors = {
        draft: "bg-gray-700 border-gray-600 text-gray-300",
        scheduled: "bg-blue-900/40 border-blue-700/50 text-blue-200",
        published: "bg-green-900/40 border-green-700/50 text-green-200",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={clsx(
                "p-2 rounded-md border text-xs mb-1 cursor-grab active:cursor-grabbing shadow-sm select-none transition-colors group",
                statusColors[event.status as keyof typeof statusColors] || statusColors.draft,
                isOverlay && "opacity-80 scale-105 z-50 shadow-xl"
            )}
        >
            <div className="flex items-center gap-1">
                <GripVertical size={12} className="opacity-0 group-hover:opacity-50" />
                <span className="truncate font-medium">{event.title}</span>
            </div>
            <div className="flex justify-between mt-1 text-[10px] opacity-70 px-1">
                <span>{event.platform}</span>
            </div>
        </div>
    );
}

function DroppableDay({ day, currentMonth, events, isToday }: { day: Date, currentMonth: Date, events: any[], isToday: boolean }) {
    const { setNodeRef, isOver } = useDroppable({
        id: day.toISOString(),
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "min-h-[120px] p-2 border border-white/5 transition-colors relative",
                !isSameMonth(day, currentMonth) && "opacity-30 bg-black/20",
                isSameMonth(day, currentMonth) && "bg-white/[0.02]",
                isOver && "bg-brand-purple/10 ring-2 ring-inset ring-brand-purple/50",
                isToday && "bg-brand-purple/5 border-t-2 border-t-brand-purple"
            )}
        >
            <div className={clsx(
                "text-sm font-medium mb-2 w-7 h-7 flex items-center justify-center rounded-full",
                isToday ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/50" : "text-gray-400"
            )}>
                {format(day, "d")}
            </div>

            <div className="space-y-1">
                {events.map(event => (
                    <DraggableEvent key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}


// --- Main Page ---

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        setLoading(true);
        const { data } = await supabase.from('posts').select('*');
        if (data) setEvents(data);
        setLoading(false);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const eventId = active.id as string;
            const newDateIso = over.id as string;
            const newDate = new Date(newDateIso);

            // Optimistic update
            const oldEvents = [...events];
            setEvents(events.map(ev =>
                ev.id === eventId
                    ? { ...ev, date: newDateIso } // temporarily use ISO string for sorting/filtering
                    : ev
            ));

            // DB Update
            const { error } = await supabase
                .from('posts')
                .update({ date: newDate.toISOString() })
                .eq('id', eventId);

            if (error) {
                console.error('Update failed:', error);
                // Rollback
                setEvents(oldEvents);
                alert("Failed to update date");
            }
        }
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }


    // Calendar Grid Logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-sans)]">
            {/* Header */}
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <CalendarIcon className="text-brand-purple" /> Content Calendar
                    </h1>
                    {loading && <Loader2 className="animate-spin text-gray-500" />}
                </div>

                <div className="flex items-center gap-4 glass px-4 py-2 rounded-lg">
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="hover:text-white text-gray-400">
                        <ChevronLeft />
                    </button>
                    <span className="font-semibold text-lg w-32 text-center select-none">
                        {format(currentDate, "MMMM yyyy")}
                    </span>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="hover:text-white text-gray-400">
                        <ChevronRight />
                    </button>
                </div>
            </header>

            {/* Calendar Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="glass rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                    {/* Week Headers */}
                    <div className="grid grid-cols-7 bg-white/5 border-b border-white/10">
                        {weekDays.map(day => (
                            <div key={day} className="py-3 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 bg-black/40">
                        {days.map(day => {
                            // Filter events for this day
                            const dayEvents = events.filter(ev => isSameDay(parseISO(ev.date), day));

                            return (
                                <DroppableDay
                                    key={day.toISOString()}
                                    day={day}
                                    currentMonth={currentDate}
                                    events={dayEvents}
                                    isToday={isSameDay(day, new Date())}
                                />
                            );
                        })}
                    </div>
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div className="opacity-80 scale-105 pointer-events-none">
                            <div className="p-2 rounded-md border text-xs bg-brand-purple text-white shadow-xl border-brand-purple-dark">
                                <span className="font-medium">Moving event...</span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
