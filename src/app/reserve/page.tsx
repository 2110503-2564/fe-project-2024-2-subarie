'use client'
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";
import { AppDispatch } from "@/redux/store";
import { addBooking } from "@/redux/features/bookSlice";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSession } from "next-auth/react";
import styles from '@/components/banner-search.module.css';
import Image from "next/image";
import getUserProfile from "@/libs/getUserProfile";

// Define the Car interface based on your API response
interface Car {
    _id: string;
    brand: string;
    model: string;
    type: string;
    color: string;
    license_plate: string;
    dailyRate: number;
    tier: number;
    provider_id: string;
    manufactureDate: string;
}

export default function Booking(){
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>()
    const venueItems = useAppSelector((state)=> state.bookSlice.bookItems)

    const timeOptions = [
        '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', 
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
        '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
        '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'
    ];

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<{
        name: string;
        telephone_number: string;
    } | null>(null);

    const makeBooking = async () => {
        if(nameLastname && tel && pickupDate && returnDate && pickupTime && returnTime && car){
            // Check if car is available for selected dates
            const isAvailable = await checkCarAvailability(car._id, pickupDate, returnDate);

            if (!isAvailable) {
                alert('Car is not available for the selected dates. Please choose different dates.');
                return;
            }

            const item:BookingItem ={
                nameLastname: nameLastname,
                tel: tel,
                car: car._id,
                bookDate: pickupDate.format("YYYY/MM/DD"),
                returnDate: returnDate.format("YYYY/MM/DD"),
                pickupTime: pickupTime,
                returnTime: returnTime
            }
            console.log(item);
            
            try {
                // Send booking data to backend
                const response = await fetch('/api/v1/rents', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session?.user?.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        startDate: item.bookDate,
                        returnDate: item.returnDate,
                        car: item.car,
                        // Include other booking fields as needed
                    })
                });
    
                if (response.ok) {
                    // Booking successful, dispatch to Redux store
                    dispatch(addBooking(item));
                    alert('Booking successful!');
                } else {
                    console.error('Booking failed:', response.statusText);
                    alert('Booking failed. Please try again.');
                }
            } catch (error) {
                console.error('Error booking:', error);
                alert('An error occurred. Please try again.');
            }
        }
    }
    

    // Function to check car availability
    const checkCarAvailability = async (carId: string, startDate: Dayjs, endDate: Dayjs) => {
        try {
            const response = await fetch(`/api/v1/cars/${carId}/availability?startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch car availability');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error checking car availability:', error);
            return null;
        }
    };
    

    const [nameLastname, setNameLastname] = useState<string>('');
    const [tel, setTel] = useState<string>('');
    const [pickupDate, setPickupDate] = useState<Dayjs | null>(null);
    const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
    const [pickupTime, setPickupTime] = useState<string>('10:00 AM');
    const [returnTime, setReturnTime] = useState<string>('10:00 AM');

    // Fetch car details and user profile
    useEffect(() => {
        const carId = searchParams.get('carId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const providedPickupTime = searchParams.get('pickupTime');
        const providedReturnTime = searchParams.get('returnTime');

        const fetchData = async () => {
            // Fetch car details
            if (!carId) {
                setError('No car ID provided');
                setLoading(false);
                return;
            }

            try {
                // Fetch car details
                const carResponse = await fetch(`http://localhost:5000/api/v1/cars/${carId}`);
                
                if (!carResponse.ok) {
                    throw new Error('Failed to fetch car details');
                }

                const carData = await carResponse.json();
                
                if (carData.success && carData.data) {
                    setCar(carData.data);
                } else {
                    throw new Error('Invalid car data received');
                }

                // Fetch user profile if session exists
                if (session?.user?.token) {
                    const userProfileResponse = await getUserProfile(session.user.token);
                    
                    if (userProfileResponse.success && userProfileResponse.data) {
                        setUserData({
                            name: userProfileResponse.data.name,
                            telephone_number: userProfileResponse.data.telephone_number
                        });

                        // Prefill form with user data
                        setNameLastname(userProfileResponse.data.name);
                        setTel(userProfileResponse.data.telephone_number);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        // Prefill dates and times
        if (startDate) {
            setPickupDate(dayjs(startDate));
        }
        if (endDate) {
            setReturnDate(dayjs(endDate));
        }
        if (providedPickupTime) {
            setPickupTime(providedPickupTime);
        }
        if (providedReturnTime) {
            setReturnTime(providedReturnTime);
        }

        fetchData();
    }, [searchParams, session]);

    // Tier name mapping
    const getTierName = (tier: number) => {
        const tierNames = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
        return tierNames[tier] || `Tier ${tier}`;
    };

    if (loading) {
        return (
            <main className="max-w-6xl mx-auto py-10 px-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8A7D55] mx-auto"></div>
                <p className="mt-4">Loading car details...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-6xl mx-auto py-10 px-4 text-center">
                <div className="bg-red-100 text-red-800 p-4 rounded-lg">
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    return(
        <main className="max-w-6xl mx-auto py-10 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-medium mb-3">Make Your Reservation</h1>
                <p className="text-gray-600 max-w-3xl mx-auto">
                    Complete the details below to reserve your vehicle
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Booking Information */}
                <div>
                    <h2 className="text-2xl font-medium mb-6">Booking Information</h2>
                    <div className="bg-white shadow-md rounded-lg p-8">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <input 
                                    type="text"
                                    value={nameLastname}
                                    onChange={(e) => setNameLastname(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7D55] mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Contact Number</p>
                                <input 
                                    type="tel"
                                    value={tel}
                                    onChange={(e) => setTel(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7D55] mt-1"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Pickup Date</p>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <div className={styles.datePickerContainer}>
                                            <DatePicker
                                                value={pickupDate}
                                                onChange={(newValue) => setPickupDate(newValue)}
                                                className={styles.datePicker}
                                                slotProps={{
                                                    textField: {
                                                        variant: 'outlined',
                                                        fullWidth: true,
                                                        size: 'small',
                                                        InputProps: {
                                                            className: styles.datePickerInput,
                                                            endAdornment: null,
                                                            style: { 
                                                                fontSize: '14px',
                                                                padding: 0
                                                            }
                                                        }
                                                    },
                                                    field: {
                                                        shouldRespectLeadingZeros: true,
                                                        format: 'MM/DD/YYYY'
                                                    }
                                                }}
                                            />
                                        </div>
                                    </LocalizationProvider>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Pickup Time</p>
                                    <select 
                                        value={pickupTime}
                                        onChange={(e) => setPickupTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7D55]"
                                    >
                                        {timeOptions.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Return Date</p>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <div className={styles.datePickerContainer}>
                                            <DatePicker
                                                value={returnDate}
                                                onChange={(newValue) => setReturnDate(newValue)}
                                                className={styles.datePicker}
                                                slotProps={{
                                                    textField: {
                                                        variant: 'outlined',
                                                        fullWidth: true,
                                                        size: 'small',
                                                        InputProps: {
                                                            className: styles.datePickerInput,
                                                            endAdornment: null,
                                                            style: { 
                                                                fontSize: '14px',
                                                                padding: 0
                                                            }
                                                        }
                                                    },
                                                    field: {
                                                        shouldRespectLeadingZeros: true,
                                                        format: 'MM/DD/YYYY'
                                                    }
                                                }}
                                            />
                                        </div>
                                    </LocalizationProvider>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Return Time</p>
                                    <select 
                                        value={returnTime}
                                        onChange={(e) => setReturnTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A7D55]"
                                    >
                                        {timeOptions.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <button 
                                    type="submit" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        makeBooking();
                                    }}
                                    className="w-full py-3 bg-[#8A7D55] text-white rounded-md hover:bg-[#766b48] transition-colors mt-2"
                                >
                                    Confirm Reservation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Car Details */}
                {car && (
                    <div>
                        <h2 className="text-2xl font-medium mb-6">Vehicle Details</h2>
                        <div className="bg-white shadow-md rounded-lg p-8">
                            <div className="mb-6">
                                <Image 
                                    src="/img/car-default.jpg" 
                                    alt={`${car.brand} ${car.model}`} 
                                    width={400} 
                                    height={250} 
                                    className="w-full h-[250px] object-cover rounded-lg"
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-[#8A7D55]">{car.brand} {car.model}</h3>
                                    <p className="text-gray-600">{car.type} | {car.color}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">License Plate</p>
                                        <p className="font-medium">{car.license_plate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Daily Rate</p>
                                        <p className="font-medium">${car.dailyRate.toFixed(2)}/day</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Manufacture Date</p>
                                        <p className="font-medium">
                                            {new Date(car.manufactureDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tier</p>
                                        <p className="font-medium">{getTierName(car.tier)}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                        Available
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}