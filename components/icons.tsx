
import React from 'react';

// Helper component to render Google Material Symbols
// Using styles to ensure they fit the previous 32px container (w-8 h-8)
const MaterialIcon = ({ name }: { name: string }) => (
    <span 
        className="material-symbols-rounded select-none" 
        style={{ fontSize: '32px', display: 'block', lineHeight: 1 }}
    >
        {name}
    </span>
);

export const CameraIcon = () => <MaterialIcon name="simulation" />;
export const ActivityIcon = () => <MaterialIcon name="kitesurfing" />;
export const VipCardIcon = () => <MaterialIcon name="badge" />;
export const TshirtIcon = () => <MaterialIcon name="apparel" />;
export const PaellaIcon = () => <MaterialIcon name="restaurant" />;
export const PartyIcon = () => <MaterialIcon name="celebration" />;
export const DinnerIcon = () => <MaterialIcon name="restaurant" />;
export const DrinksIcon = () => <MaterialIcon name="local_bar" />;
export const TicketIcon = () => <MaterialIcon name="local_activity" />;
export const ExtraActivityIcon = () => <MaterialIcon name="kitesurfing" />;
export const BedIcon = () => <MaterialIcon name="hotel" />;

export const CalendarIcon = () => (
    <span 
        className="material-symbols-rounded select-none" 
        style={{ fontSize: '24px', display: 'block', lineHeight: 1 }}
    >
        calendar_today
    </span>
);
