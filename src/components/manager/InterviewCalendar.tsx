'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, MapPin, Video } from 'lucide-react';

interface Interview {
  id: number;
  candidateName: string;
  position: string;
  date: Date;
  time: string;
  duration: number;
  type: 'in-person' | 'video';
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Données de démonstration
const mockInterviews: Interview[] = [
  {
    id: 1,
    candidateName: 'Jean Martin',
    position: 'Développeur Full Stack',
    date: new Date(),
    time: '14:00',
    duration: 60,
    type: 'in-person',
    location: 'Salle A',
    status: 'scheduled'
  },
  {
    id: 2,
    candidateName: 'Marie Dubois',
    position: 'DevOps Engineer',
    date: new Date(Date.now() + 86400000),
    time: '10:30',
    duration: 45,
    type: 'video',
    status: 'scheduled'
  },
  {
    id: 3,
    candidateName: 'Pierre Durand',
    position: 'Data Scientist',
    date: new Date(Date.now() + 172800000),
    time: '15:00',
    duration: 90,
    type: 'in-person',
    location: 'Salle B',
    status: 'scheduled'
  }
];

export function InterviewCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getInterviewsForDate = (date: Date) => {
    return mockInterviews.filter(interview => 
      interview.date.toDateString() === date.toDateString()
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const interviews = getInterviewsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`
            p-2 border rounded-lg cursor-pointer transition-all
            ${isToday ? 'bg-primary/10 border-primary' : 'border-transparent'}
            ${isSelected ? 'ring-2 ring-primary' : ''}
            ${interviews.length > 0 ? 'bg-muted' : ''}
            hover:bg-muted/50
          `}
        >
          <div className="font-medium text-sm">{day}</div>
          {interviews.length > 0 && (
            <div className="mt-1">
              <Badge variant="secondary" className="text-xs">
                {interviews.length} entretien{interviews.length > 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDateInterviews = selectedDate ? getInterviewsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>

      {/* Selected Date Interviews */}
      {selectedDate && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Entretiens du {selectedDate.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </h3>
          
          {selectedDateInterviews.length === 0 ? (
            <p className="text-muted-foreground">Aucun entretien planifié pour cette date</p>
          ) : (
            <div className="space-y-3">
              {selectedDateInterviews.map(interview => (
                <div key={interview.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{interview.candidateName}</h4>
                      <p className="text-sm text-muted-foreground">{interview.position}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {interview.time} ({interview.duration} min)
                        </span>
                        {interview.type === 'in-person' ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {interview.location}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            Visioconférence
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant={interview.status === 'scheduled' ? 'default' : 'secondary'}>
                      {interview.status === 'scheduled' ? 'Planifié' : 
                       interview.status === 'completed' ? 'Terminé' : 'Annulé'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}