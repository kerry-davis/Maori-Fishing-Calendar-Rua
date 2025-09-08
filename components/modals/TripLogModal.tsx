import React, { useState, useEffect, useCallback } from 'react';
import type { Trip, FishCatch, WeatherLog } from '../../types';
import { Modal } from './Modal';
import { addTrip, getTripsByDate, updateTrip, deleteTrip, addFish, getFishByTrip, updateFish, deleteFish, addWeather, getWeatherByTrip, updateWeather, deleteWeather } from '../../lib/db';

// --- Reusable Form Components ---
const Input = (props) => <input {...props} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />;
const TextArea = (props) => <textarea {...props} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />;
const Button = ({ children, ...props }) => <button {...props} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{children}</button>;

// --- Helper Functions ---
const formatDate = (date: Date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

// --- Add/Edit Modals ---

const TripDetailsModal = ({ trip, date, onSave, onCancel }) => {
    const [formData, setFormData] = useState(trip || { date: formatDate(date), water: '', location: '', hours: '', companions: '', notes: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    return (
        <Modal title={trip ? "Edit Trip" : "Add Trip"} onClose={onCancel}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="water" placeholder="Water Body (e.g., Lake Taupo)" value={formData.water} onChange={handleChange} required />
                <Input name="location" placeholder="Specific Location (e.g., Stump Bay)" value={formData.location} onChange={handleChange} />
                <Input type="number" name="hours" placeholder="Hours Fished" value={formData.hours} onChange={handleChange} step="0.1" />
                <Input name="companions" placeholder="Companions" value={formData.companions} onChange={handleChange} />
                <TextArea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} />
                <Button type="submit">{trip ? "Update Trip" : "Save Trip"}</Button>
            </form>
        </Modal>
    );
};

const FishCatchModal = ({ fish, tripId, onSave, onCancel }) => {
    const [formData, setFormData] = useState(fish || { tripId, species: '', length: '', weight: '', time: '', gear: '', details: '', photo: null });
    const [photoPreview, setPhotoPreview] = useState(fish?.photo);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result });
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const gearArray = typeof formData.gear === 'string' ? formData.gear.split(',').map(s => s.trim()) : formData.gear;
        onSave({ ...formData, gear: gearArray });
    };

    return (
        <Modal title={fish ? "Edit Catch" : "Add Catch"} onClose={onCancel}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="species" placeholder="Species" value={formData.species} onChange={handleChange} required />
                <div className="grid grid-cols-3 gap-2">
                    <Input name="length" placeholder="Length (cm)" value={formData.length} onChange={handleChange} />
                    <Input name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} />
                    <Input type="time" name="time" placeholder="Time" value={formData.time} onChange={handleChange} />
                </div>
                <Input name="gear" placeholder="Gear (comma-separated)" value={Array.isArray(formData.gear) ? formData.gear.join(', ') : formData.gear} onChange={handleChange} />
                <TextArea name="details" placeholder="Details" value={formData.details} onChange={handleChange} />
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Photo</label>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
                    {photoPreview && <img src={photoPreview} alt="Preview" className="mt-2 rounded-lg max-h-40" />}
                </div>
                <Button type="submit">{fish ? "Update Catch" : "Save Catch"}</Button>
            </form>
        </Modal>
    );
};


// --- Main Trip Log Modal ---

export const TripLogModal = ({ date, onClose, onDataChange }) => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [catches, setCatches] = useState<Record<number, FishCatch[]>>({});
    // FIX: Explicitly type the view state to allow for a tripId when adding a new fish, resolving errors on lines 148, 174, and 187.
    const [view, setView] = useState<{ type: string; data: any; tripId?: number; }>({ type: 'list', data: null }); // {type: 'addTrip' | 'editTrip' | 'addFish' | 'editFish', data: trip/fish}
    
    const dateString = formatDate(date);

    const loadData = useCallback(async () => {
        const loadedTrips = await getTripsByDate(dateString);
        setTrips(loadedTrips);
        const catchesByTrip = {};
        for (const trip of loadedTrips) {
            catchesByTrip[trip.id] = await getFishByTrip(trip.id);
        }
        setCatches(catchesByTrip);
    }, [dateString]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSaveTrip = async (tripData) => {
        if (tripData.id) {
            await updateTrip(tripData);
        } else {
            await addTrip(tripData);
        }
        onDataChange();
        loadData();
        setView({ type: 'list', data: null });
    };

    const handleDeleteTrip = async (tripId) => {
        if (confirm('Are you sure you want to delete this trip and all its catches?')) {
            await deleteTrip(tripId);
            onDataChange();
            loadData();
        }
    };
    
     const handleSaveFish = async (fishData) => {
        if (fishData.id) {
            await updateFish(fishData);
        } else {
            await addFish(fishData);
        }
        loadData();
        setView({ type: 'list', data: null });
    };
    
    const handleDeleteFish = async (fishId) => {
         if (confirm('Delete this catch?')) {
            await deleteFish(fishId);
            loadData();
        }
    }

    if (view.type === 'addTrip' || view.type === 'editTrip') {
        return <TripDetailsModal trip={view.data} date={date} onSave={handleSaveTrip} onCancel={() => setView({ type: 'list', data: null })} />;
    }
    
    if (view.type === 'addFish' || view.type === 'editFish') {
        return <FishCatchModal fish={view.data} tripId={view.tripId} onSave={handleSaveFish} onCancel={() => setView({ type: 'list', data: null })} />;
    }

    return (
        <Modal title={`Trip Logs for ${date.toLocaleDateString()}`} onClose={onClose} size="xl">
            <div className="space-y-4">
                {trips.length === 0 ? (
                    <p className="text-center text-slate-400 py-4">No trips logged for this day.</p>
                ) : (
                    trips.map(trip => (
                        <div key={trip.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-lg text-white">{trip.water}</h4>
                                    <p className="text-sm text-slate-400">{trip.location}</p>
                                    <p className="text-sm text-slate-400">{trip.hours} hours fished with {trip.companions || 'no one'}</p>
                                    <p className="text-sm italic text-slate-300 mt-1">"{trip.notes}"</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setView({type: 'editTrip', data: trip})} className="text-slate-400 hover:text-white"><i className="fas fa-pencil"></i></button>
                                    <button onClick={() => handleDeleteTrip(trip.id)} className="text-slate-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                             <div className="mt-4 border-t border-slate-700 pt-3">
                                <h5 className="font-semibold mb-2 flex justify-between items-center">
                                    Catches ({catches[trip.id]?.length || 0})
                                    {/* FIX: Ensure `data` property is provided when setting state, as required by the updated state type. */}
                                    <button onClick={() => setView({ type: 'addFish', data: null, tripId: trip.id })} className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold py-1 px-2 rounded">Add Fish</button>
                                </h5>
                                <div className="space-y-2">
                                    {catches[trip.id]?.map(fish => (
                                        <div key={fish.id} className="flex items-start justify-between text-sm bg-slate-800 p-2 rounded">
                                           <div className="flex items-start gap-3">
                                                {fish.photo && <img src={fish.photo} alt={fish.species} className="w-16 h-16 object-cover rounded"/>}
                                                <div>
                                                    <p><strong>{fish.species}</strong> - {fish.length} / {fish.weight}</p>
                                                    <p className="text-slate-400">Caught at {fish.time} on {fish.gear.join(', ')}</p>
                                                </div>
                                           </div>
                                            <div className="flex gap-2">
                                                 <button onClick={() => setView({type: 'editFish', data: fish, tripId: trip.id})} className="text-slate-400 hover:text-white text-xs"><i className="fas fa-pencil"></i></button>
                                                 <button onClick={() => handleDeleteFish(fish.id)} className="text-slate-400 hover:text-red-500 text-xs"><i className="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <Button onClick={() => setView({ type: 'addTrip', data: null })}>Log a New Trip</Button>
            </div>
        </Modal>
    );
};
