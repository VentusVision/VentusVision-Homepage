import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Search, ShoppingCart, Battery, BatteryCharging, Zap, Activity, Tag,
  Copy, X, ArrowUpDown, Check, Clock,
  Thermometer, Gauge, Droplets, Wrench, Shield, AlertTriangle,
  MapPin, Navigation, Car, Wifi, Radio, Smartphone,
  Plug, CreditCard, Home, Settings, Key, BarChart2, Wind,
  Calendar, Cpu, Eye, Phone, Star, Moon, Globe, Lock, User,
  Download, Server, Volume2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { EASE_PREMIUM, glowHover } from "../../lib/motion";

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const SEARCH_TERMS = [
  "EV charging range",
  "battery health index",
  "engine rpm telemetry",
  "brake pad wear level",
  "real-time vehicle position",
  "accident call automatic",
];

const TICKER_RAW = [
  "vehicleSpeed · 2m ago", "motorTorque · 5m ago", "chargingPower · 12m ago",
  "batteryCapacity · 18m ago", "odometer · 24m ago", "gearState · 31m ago",
];

interface Product {
  title: string;
  status: "AVAILABLE" | "DRAFT";
  types: string[];
  oems: string[];
  description: string;
  Icon: LucideIcon;
  color: string;
}

interface Category {
  name: string;
  count: number;
  products: Product[];
}

// 8 rotating colors per card slot
const C = ["#60a5fa","#4ade80","#fb923c","#a855f7","#f43f5e","#facc15","#22d3ee","#ec4899"] as const;

const CATALOG_DATA: Category[] = [
  {
    name: "Charging & EV", count: 34,
    products: [
      { title: "AC Charging Session Data",        status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW"],   Icon: Zap,            color: C[0], description: "Real-time and historical data on AC charging events including start/end time, energy transferred, and charging point ID." },
      { title: "DC Fast Charge Events",           status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Tesla","Porsche","Hyundai"],   Icon: BatteryCharging, color: C[1], description: "Data on DC fast charging sessions including peak power, thermal throttling events, and session duration." },
      { title: "State of Charge (SoC)",           status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","VW","Tesla","Renault"], Icon: Battery,        color: C[2], description: "Current battery charge level as a percentage, sampled at configurable intervals." },
      { title: "Charging Cable Connection Status", status: "AVAILABLE", types: ["B2C"],      oems: ["BMW","VW","Renault","Stellantis"],   Icon: Plug,           color: C[3], description: "Boolean status indicating whether a charging cable is currently connected and locked." },
      { title: "Est. Charging Completion Time",   status: "AVAILABLE", types: ["B2B","B2C"], oems: ["Tesla","BMW","Audi","Porsche"],      Icon: Clock,          color: C[4], description: "Predicted time until battery is fully charged based on current SoC, charging rate, and battery temperature." },
      { title: "Charging Cost per Session",       status: "DRAFT",     types: ["B2C"],       oems: ["BMW","Mercedes-Benz","Tesla"],       Icon: CreditCard,     color: C[5], description: "Cost data per charging session including tariff type, currency, and total amount billed." },
      { title: "Wallbox Communication Data",      status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","VW","Renault"],         Icon: Home,           color: C[6], description: "Data exchanged between the vehicle and home charging station (OCPP protocol), including schedules and load management signals." },
      { title: "Preconditioning Activation Events", status: "AVAILABLE", types: ["B2C"],     oems: ["BMW","Tesla","Mercedes-Benz"],       Icon: Thermometer,    color: C[7], description: "Records of cabin and battery preconditioning events triggered remotely or by departure timer." },
    ],
  },
  {
    name: "Battery & Energy", count: 62,
    products: [
      { title: "Battery Health Index",            status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Tesla","Hyundai"], Icon: Battery,    color: C[0], description: "Aggregated health score (0–100) of the high-voltage battery based on capacity fade and internal resistance measurements." },
      { title: "Battery Cell Temperature",        status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Tesla","Porsche","Audi"],      Icon: Thermometer,    color: C[1], description: "Temperature readings from individual battery cell groups during driving and charging cycles." },
      { title: "State of Health (SoH)",           status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Mercedes-Benz","VW","Renault","Hyundai"], Icon: Battery, color: C[2], description: "Current battery capacity as a percentage of original design capacity, updated after each full cycle." },
      { title: "Auxiliary Energy Consumption",    status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Tesla","Stellantis"], Icon: Zap, color: C[3], description: "Energy consumed by auxiliary systems (HVAC, infotainment, lighting) broken down per subsystem." },
      { title: "Regenerative Braking Energy",     status: "AVAILABLE", types: ["B2B","B2C"], oems: ["Tesla","BMW","Hyundai","Renault","VW"], Icon: Activity,    color: C[4], description: "Amount of energy recovered through regenerative braking per trip and cumulatively." },
      { title: "Battery Charge Event",            status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Tesla","Porsche","VW"], Icon: BatteryCharging, color: C[5], description: "Detailed log of every charge event including duration, energy in kWh, start SoC, and end SoC." },
      { title: "Thermal Management Status",       status: "DRAFT",     types: ["B2B"],       oems: ["BMW","Mercedes-Benz","Audi","Porsche"], Icon: Thermometer,  color: C[6], description: "Status of active battery cooling and heating systems including pump speed and coolant temperature." },
      { title: "Battery Charge Target Setting",   status: "AVAILABLE", types: ["B2C"],       oems: ["BMW","Tesla","Audi","Mercedes-Benz","VW"], Icon: Tag,       color: C[7], description: "User-configured maximum charge level setting to preserve long-term battery health." },
    ],
  },
  {
    name: "Powertrain & Engine", count: 24,
    products: [
      { title: "Engine RPM Telemetry",            status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Toyota"], Icon: Gauge,  color: C[0], description: "Continuous engine speed data in RPM sampled at 10 Hz during active driving." },
      { title: "Torque Output Data",              status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Porsche","Mercedes-Benz","Tesla"], Icon: Settings, color: C[1], description: "Actual vs. requested torque values per motor/engine, including split torque for AWD systems." },
      { title: "Transmission Gear State",         status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Stellantis"], Icon: ArrowUpDown, color: C[2], description: "Current gear position, shift events, and transmission mode (D/S/N/R) with timestamps." },
      { title: "Motor Temperature",               status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Tesla","Hyundai","Audi","Porsche"], Icon: Thermometer, color: C[3], description: "Temperature readings for electric motor stators and windings sampled during high-load events." },
      { title: "Drivetrain Mode Selection",       status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Porsche","Mercedes-Benz","Ford","Volvo"], Icon: Car, color: C[4], description: "Active driving mode (Eco, Comfort, Sport, Offroad) with timestamp and mode duration." },
      { title: "AWD Torque Distribution",         status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Porsche","Mercedes-Benz","VW"], Icon: Activity, color: C[5], description: "Real-time torque split between front and rear axle for AWD vehicles in percentage." },
      { title: "Hybrid System Energy Flow",       status: "DRAFT",     types: ["B2B"],       oems: ["Toyota","BMW","Mercedes-Benz","Stellantis","Ford"], Icon: Zap, color: C[6], description: "Power flow direction and magnitude between ICE, electric motor, and battery in hybrid vehicles." },
      { title: "Engine Start/Stop Events",        status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Renault","Ford"], Icon: Key, color: C[7], description: "Log of engine start and stop events including ignition key, remote start, and auto-start." },
    ],
  },
  {
    name: "Fuel & Combustion", count: 42,
    products: [
      { title: "Fuel Level Sensor Data",          status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Toyota","Stellantis"], Icon: Gauge, color: C[0], description: "Current fuel tank level in liters and as a percentage, updated on change events." },
      { title: "Instantaneous Fuel Consumption",  status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Renault"], Icon: Activity, color: C[1], description: "Real-time fuel consumption in liters per 100 km calculated every second during active driving." },
      { title: "Average Fuel Consumption/Trip",   status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","Toyota","Ford","Volvo"], Icon: BarChart2, color: C[2], description: "Average fuel consumption per completed trip, including highway and urban breakdowns." },
      { title: "CO₂ Emission Data",              status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Renault","Stellantis"], Icon: Wind, color: C[3], description: "Calculated CO₂ emissions per trip and per 100 km based on fuel consumption and fuel type." },
      { title: "Refueling Events",                status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Toyota"], Icon: Droplets, color: C[4], description: "Log of refueling events with timestamp, volume added, and GPS location of the station." },
      { title: "AdBlue / DEF Level",              status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Volvo"], Icon: Droplets, color: C[5], description: "Current AdBlue (Diesel Exhaust Fluid) level for diesel vehicles, with low-level alerts." },
      { title: "Engine Idle Time Data",           status: "DRAFT",     types: ["B2B"],       oems: ["Ford","VW","Mercedes-Benz","Renault","Stellantis","Toyota"], Icon: Clock, color: C[6], description: "Cumulative idle time per trip and per day with fuel burned during idle." },
      { title: "Fuel Type Identification",        status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","VW","Ford","Renault","Stellantis"], Icon: Tag, color: C[7], description: "Detected fuel type (petrol, diesel, LPG, E85) based on sensor data and ECU configuration." },
    ],
  },
  {
    name: "Maintenance & Diag.", count: 88,
    products: [
      { title: "OBD-II Diagnostic Trouble Codes", status: "AVAILABLE", types: ["B2B"],      oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Toyota","Stellantis","Renault"], Icon: Wrench, color: C[0], description: "Active and pending fault codes (DTCs) from all ECUs with code description and severity level." },
      { title: "Service Interval Status",         status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Volvo","Toyota"], Icon: Calendar, color: C[1], description: "Remaining distance and days until next scheduled service (oil, brake fluid, inspection)." },
      { title: "Brake Pad Wear Level",            status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Porsche","VW"],       Icon: Shield,   color: C[2], description: "Current brake pad thickness as a percentage of original depth, per axle." },
      { title: "Tyre Pressure Monitoring",        status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Tesla","Ford","Renault"], Icon: Activity, color: C[3], description: "Real-time tyre pressure readings for all four wheels via TPMS sensors, with temperature." },
      { title: "Oil Life Remaining",              status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","Ford","Toyota","Stellantis"], Icon: Droplets, color: C[4], description: "Calculated engine oil life based on driving patterns, temperature, and mileage." },
      { title: "ECU Software Version",            status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Tesla","VW"],         Icon: Cpu,      color: C[5], description: "Current software version identifiers for all major electronic control units in the vehicle." },
      { title: "Battery 12V Status",              status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Renault","Toyota"], Icon: Battery, color: C[6], description: "Voltage and charge state of the 12V auxiliary battery used for electronics and starting." },
      { title: "Wiper Blade Usage Events",        status: "DRAFT",     types: ["B2B"],       oems: ["BMW","VW","Renault","Stellantis","Ford"],           Icon: Activity, color: C[7], description: "Count and frequency of windshield wiper activations as proxy for weather and road conditions." },
    ],
  },
  {
    name: "Safety & Incidents", count: 51,
    products: [
      { title: "Auto Emergency Braking Events",   status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Volvo","Tesla","Hyundai"], Icon: AlertTriangle, color: C[0], description: "Records of AEB system activations including trigger speed, deceleration force, and GPS coordinates." },
      { title: "Airbag Deployment Events",        status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Toyota","Ford"], Icon: Shield,        color: C[1], description: "Log of airbag and seatbelt pretensioner deployment with timestamp and impact direction." },
      { title: "Lane Departure Warning Events",   status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Tesla","Volvo","Ford"], Icon: AlertTriangle, color: C[2], description: "Instances where the vehicle crossed lane markings without indicator activation." },
      { title: "Collision Detection Data",        status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Volvo","Tesla"],       Icon: AlertTriangle, color: C[3], description: "Accelerometer data around collision events with G-force values per axis and direction." },
      { title: "Driver Attention Alert Events",   status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Volvo","Toyota"],     Icon: Eye,           color: C[4], description: "Activations of the driver drowsiness and attention monitoring system with severity level." },
      { title: "Forward Collision Warning Events", status: "AVAILABLE", types: ["B2B"],      oems: ["BMW","Audi","Mercedes-Benz","Tesla","Hyundai","Ford"], Icon: AlertTriangle, color: C[5], description: "Pre-collision alert events with time-to-collision value, relative speed, and GPS position." },
      { title: "Blind Spot Detection Events",     status: "DRAFT",     types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Ford","Volvo","Stellantis"], Icon: Eye,     color: C[6], description: "Count and timing of blind spot warning activations per trip segment." },
      { title: "Post-Crash Emergency Call Data",  status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Renault","Stellantis"], Icon: Phone,  color: C[7], description: "eCall data transmitted after a crash including GPS coordinates, severity, and occupant count." },
    ],
  },
  {
    name: "Trip & Driving Behavior", count: 31,
    products: [
      { title: "Trip Summary Data",               status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Tesla","Ford","Renault"], Icon: MapPin, color: C[0], description: "Per-trip summary including start/end time, total distance, average speed, and energy consumed." },
      { title: "Harsh Braking Events",            status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Renault","Stellantis"], Icon: AlertTriangle, color: C[1], description: "Instances of hard braking with deceleration above threshold (>0.3g), with GPS and speed context." },
      { title: "Harsh Acceleration Events",       status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Porsche","Tesla","Ford"], Icon: Gauge,  color: C[2], description: "Instances of rapid acceleration above defined threshold with timestamp, speed, and location." },
      { title: "Cornering Behavior Data",         status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Porsche","Mercedes-Benz","Tesla"],     Icon: Activity, color: C[3], description: "Lateral G-force data during cornering events above threshold, aggregated per trip." },
      { title: "Speeding Events",                 status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Renault","Volvo"], Icon: AlertTriangle, color: C[4], description: "Records of instances where vehicle speed exceeded the legal speed limit, with duration and location." },
      { title: "Driving Score per Trip",          status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","Toyota","Renault","Hyundai"], Icon: Star, color: C[5], description: "Aggregated driving quality score (0–100) per trip based on acceleration, braking, and cornering." },
      { title: "Night Driving Hours",             status: "DRAFT",     types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Ford","Renault","Stellantis"], Icon: Moon, color: C[6], description: "Total hours driven between 22:00 and 06:00, aggregated per week and per driver." },
      { title: "Motorway vs. Urban Split",        status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Toyota","Volvo"], Icon: MapPin, color: C[7], description: "Percentage breakdown of distance driven on motorways, rural roads, and urban environments." },
    ],
  },
  {
    name: "Location & Navigation", count: 11,
    products: [
      { title: "Real-Time Vehicle Position",      status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Tesla","Ford","Renault"], Icon: MapPin, color: C[0], description: "Current GPS coordinates with accuracy radius, altitude, and heading, updated at 1 Hz." },
      { title: "Trip Route Polyline",             status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Tesla","Volvo","Ford"], Icon: Navigation, color: C[1], description: "Full GPS track of each trip as an encoded polyline, sampled every 5 seconds." },
      { title: "Home & Work Location Detection",  status: "DRAFT",     types: ["B2B"],       oems: ["BMW","Mercedes-Benz","VW","Toyota","Renault"],     Icon: Home,       color: C[2], description: "Inferred home and work locations based on recurring parking patterns, anonymized." },
      { title: "Parking Location Data",           status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Stellantis"], Icon: MapPin,  color: C[3], description: "GPS coordinates and duration of each parking event including indoor/outdoor detection." },
      { title: "Navigation Destination Data",     status: "DRAFT",     types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Tesla","VW"],         Icon: Navigation, color: C[4], description: "Anonymized destination categories (home, work, shopping, charging) from active navigation." },
      { title: "Geofence Entry/Exit Events",      status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Tesla","Ford","Renault","Volvo"], Icon: MapPin, color: C[5], description: "Timestamps and coordinates of vehicle entering and exiting predefined geographic zones." },
      { title: "Odometer Reading",                status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Toyota","Renault","Stellantis"], Icon: Activity, color: C[6], description: "Cumulative total vehicle mileage in km, updated on every trip completion." },
      { title: "Country Border Crossings",        status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Volvo","Renault"], Icon: Globe,    color: C[7], description: "Log of detected country border crossings with timestamp, origin, and destination country." },
    ],
  },
  {
    name: "Body, Access & Comfort", count: 42,
    products: [
      { title: "Door Open/Close Events",          status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Renault","Stellantis"], Icon: Car, color: C[0], description: "Timestamped log of all door open and close events per door position (FL, FR, RL, RR, trunk)." },
      { title: "Central Lock Status",             status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Tesla","Renault"], Icon: Lock,    color: C[1], description: "Current lock state of all doors and trunk, updated on change events." },
      { title: "Cabin Temperature Data",          status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Tesla","Volvo"], Icon: Thermometer, color: C[2], description: "Interior temperature sensor readings including front/rear cabin and cargo area." },
      { title: "Climate Control Settings",        status: "AVAILABLE", types: ["B2C"],       oems: ["BMW","Audi","Mercedes-Benz","Tesla","Porsche","VW"], Icon: Wind,    color: C[3], description: "Active HVAC settings including target temperature, fan speed, seat heating, and AC state." },
      { title: "Window Position Data",            status: "DRAFT",     types: ["B2C"],       oems: ["BMW","Audi","Mercedes-Benz","Porsche","Tesla"],    Icon: Car,      color: C[4], description: "Current window open/close percentage for all windows including sunroof." },
      { title: "Seat Occupation Detection",       status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Volvo","VW"],         Icon: User,     color: C[5], description: "Detection of occupied seats via pressure sensors, used for seatbelt reminder logic." },
      { title: "Exterior Lighting Status",        status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Renault"], Icon: Car,     color: C[6], description: "State of all exterior lights (headlights, daytime running lights, indicators, brake lights)." },
      { title: "Trunk Open/Close Events",         status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Stellantis","Renault"], Icon: Car, color: C[7], description: "Timestamped events for trunk lid open and close with duration and GPS context." },
    ],
  },
  {
    name: "Connectivity & Remote", count: 9,
    products: [
      { title: "Remote Start Events",             status: "AVAILABLE", types: ["B2C"],       oems: ["BMW","Audi","Mercedes-Benz","Tesla","Hyundai","Renault"], Icon: Radio,  color: C[0], description: "Log of remote engine or climate start commands with source (app/key), timestamp, and result." },
      { title: "OTA Update Status",               status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Tesla","Audi","Mercedes-Benz","VW"],          Icon: Download, color: C[1], description: "Status and history of over-the-air software updates including version, size, and install result." },
      { title: "Mobile App Connection Events",    status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Tesla","Renault","Hyundai"], Icon: Smartphone, color: C[2], description: "Log of mobile app connection and disconnection events with platform (iOS/Android) and duration." },
      { title: "Vehicle API Health Status",       status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Tesla","VW"],          Icon: Server,   color: C[3], description: "Uptime and response time data for vehicle connectivity API endpoints per manufacturer." },
      { title: "Telematics Unit Status",          status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Ford","Stellantis","Renault"], Icon: Wifi, color: C[4], description: "Connection status of the embedded TCU including network type (4G/5G) and signal strength." },
      { title: "Remote Horn & Lights Events",     status: "DRAFT",     types: ["B2C"],       oems: ["BMW","Audi","Mercedes-Benz","Renault","Hyundai"],   Icon: Volume2,  color: C[5], description: "Log of remotely triggered horn and flash-lights commands with timestamp and GPS context." },
      { title: "Shared Vehicle Access Log",       status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","Tesla","VW"],          Icon: Key,      color: C[6], description: "Record of vehicle access grants to secondary users including time windows and permissions." },
      { title: "In-Car Wi-Fi Usage Data",         status: "DRAFT",     types: ["B2C"],       oems: ["BMW","Audi","Mercedes-Benz","VW","Renault"],        Icon: Wifi,     color: C[7], description: "Aggregated data usage of the vehicle's built-in Wi-Fi hotspot per session." },
    ],
  },
];

const CART_ITEMS = [
  { id: 1, title: "Battery Health Index",     price: "1.00 EUR" },
  { id: 2, title: "Trip Summary Data",        price: "1.00 EUR" },
  { id: 3, title: "OBD-II Diagnostic Codes",  price: "1.00 EUR" },
];

const ORBITAL_R = 82;
const ORBITAL_NODES = [
  { label: "VW",    angle: -90  },
  { label: "Audi",  angle: -30  },
  { label: "Seat",  angle: 30   },
  { label: "Skoda", angle: 90   },
  { label: "Cupra", angle: 150  },
  { label: "VW CV", angle: 210  },
];

// ─────────────────────────────────────────────
// Micro-components
// ─────────────────────────────────────────────

function TypedSearch({ term }: { term: string }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const iv = setInterval(() => { i++; setShown(term.slice(0, i)); if (i >= term.length) clearInterval(iv); }, 68);
    return () => clearInterval(iv);
  }, [term]);
  return (
    <span>
      <span className="text-white/65">{shown}</span>
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}>|</motion.span>
    </span>
  );
}

function LiveTicker() {
  const dup = [...TICKER_RAW, ...TICKER_RAW];
  return (
    <div className="overflow-hidden border-b border-white/[0.05] bg-cyan-500/[0.04]">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 whitespace-nowrap px-4 py-1.5"
      >
        {dup.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 font-mono text-[8px] text-cyan-300/45">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            NEW: {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ProductCard({ title, status, types, oems, description, Icon, color, delay }: Product & { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.34, ease: EASE_PREMIUM }}
      className="flex h-full flex-col rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5"
    >
      {/* Title + icon */}
      <div className="flex items-start justify-between gap-1">
        <p className="text-[9.5px] font-bold leading-snug text-white">{title}</p>
        <span className="mt-0.5 shrink-0 rounded-md p-1.5" style={{ backgroundColor: color + "1e" }}>
          <Icon className="h-2.5 w-2.5" style={{ color }} />
        </span>
      </div>

      {/* Badges */}
      <div className="mt-1.5 flex flex-wrap items-center gap-[3px]">
        <span className={cn(
          "rounded-full px-1.5 py-[2px] text-[6px] font-bold uppercase tracking-wide",
          status === "AVAILABLE" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400",
        )}>● {status}</span>
        {types.map(t => (
          <span key={t} className={cn(
            "rounded-full px-1.5 py-[2px] text-[6px] font-semibold",
            t === "B2B" ? "bg-blue-500/15 text-blue-300" : "bg-orange-500/15 text-orange-300",
          )}>{t}</span>
        ))}
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-[7.5px] leading-[1.55] text-white/35">{description}</p>

      {/* OEM chips + cart */}
      <div className="mt-auto flex items-end justify-between gap-1 pt-2">
        <div className="flex flex-wrap gap-[3px]">
          {oems.slice(0, 2).map(oem => (
            <span key={oem} className="rounded border border-white/[0.08] px-1 py-[1px] font-mono text-[5.5px] uppercase tracking-wide text-white/28">
              {oem}
            </span>
          ))}
        </div>
        <ShoppingCart className="h-2.5 w-2.5 shrink-0 text-white/20" />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Card 1 — Product Catalog
// ─────────────────────────────────────────────

export function CatalogPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });
  const [searchIdx, setSearchIdx] = useState(0);
  const [catIdx,    setCatIdx]    = useState(0);

  useEffect(() => {
    if (!inView) return;
    const s = setInterval(() => setSearchIdx(i => (i + 1) % SEARCH_TERMS.length),  3600);
    const c = setInterval(() => setCatIdx(i    => (i + 1) % CATALOG_DATA.length),  2800);
    return () => { clearInterval(s); clearInterval(c); };
  }, [inView]);

  const currentCat = CATALOG_DATA[catIdx];

  return (
    <div ref={ref} className="flex h-full flex-col overflow-hidden">
      <LiveTicker />

      {/* Search bar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
        <Search className="h-3.5 w-3.5 shrink-0 text-white/28" />
        <span className="min-w-0 flex-1 text-[11px] text-white/28">
          {inView && <TypedSearch term={SEARCH_TERMS[searchIdx]} />}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[8px] text-white/35">Filter ▾</span>
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[8px] text-white/35">CSV</span>
          <span className="rounded-full bg-cyan-500/75 px-2.5 py-0.5 text-[8px] font-semibold text-black">Highlighting</span>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex shrink-0 items-center gap-1.5 overflow-hidden border-b border-white/[0.05] px-4 py-2">
        <span className="shrink-0 font-mono text-[7px] uppercase tracking-widest text-white/22">CATEGORIES:</span>
        <div className="flex gap-1.5 overflow-hidden">
          {CATALOG_DATA.map((cat, i) => (
            <motion.span
              key={cat.name}
              animate={{
                backgroundColor: catIdx === i ? "rgba(34,211,238,0.14)" : "rgba(255,255,255,0.04)",
                color:           catIdx === i ? "rgba(34,211,238,0.9)"  : "rgba(255,255,255,0.32)",
                borderColor:     catIdx === i ? "rgba(34,211,238,0.28)" : "rgba(255,255,255,0.07)",
              }}
              transition={{ duration: 0.32 }}
              className="shrink-0 cursor-default rounded-full border px-2.5 py-0.5 text-[8px] font-medium"
            >
              {cat.name}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="flex shrink-0 items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={`title-${catIdx}`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="text-[13px] font-extrabold text-white"
            >
              {currentCat.name}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.span
              key={`count-${catIdx}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[7.5px] font-semibold text-cyan-300"
            >
              {currentCat.count} items
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="flex items-center gap-1 text-[8px] text-white/30">
          <ArrowUpDown className="h-3 w-3" /> Popularity
        </span>
      </div>

      {/* Product grid — 4×2 = 8 cards */}
      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={`grid-${catIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="grid h-full grid-cols-4 grid-rows-2 gap-2"
          >
            {currentCat.products.map((p, i) => (
              <ProductCard key={p.title} {...p} delay={0.03 + i * 0.05} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Card 2 — Item Detail / OEM Orbital
// ─────────────────────────────────────────────

const ORBITAL_SPIN: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "center",
  animation: "orbital-spin 120s linear infinite",
};
const ORBITAL_COUNTER: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "center",
  animation: "orbital-spin-reverse 120s linear infinite",
};

function OEMOrbital({ active }: { active: boolean }) {
  return (
    <svg viewBox="-120 -120 240 240" className="h-full w-full">
      {/* CSS-animated orbital group — zero JS, zero React re-renders */}
      <g style={ORBITAL_SPIN}>
        {ORBITAL_NODES.map((node, i) => {
          const rad = node.angle * Math.PI / 180;
          const x = Math.cos(rad) * ORBITAL_R;
          const y = Math.sin(rad) * ORBITAL_R;
          return (
            <g key={node.label}>
              <motion.path
                d={`M 0 0 L ${x} ${y}`}
                stroke="rgba(34,211,238,0.14)"
                strokeWidth={1}
                fill="none"
                initial={{ pathLength: 0 }}
                animate={active ? { pathLength: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.55 }}
              />
              <g transform={`translate(${x},${y})`}>
                <motion.circle
                  r={19}
                  fill="rgba(255,255,255,0.03)"
                  stroke="rgba(255,255,255,0.11)"
                  strokeWidth={1}
                  initial={{ scale: 0 }}
                  animate={active ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.35, ease: EASE_PREMIUM }}
                />
                <g style={ORBITAL_COUNTER}>
                  <motion.text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={6.5}
                    fontWeight={600}
                    fill="rgba(255,255,255,0.55)"
                    fontFamily="ui-monospace, monospace"
                    initial={{ opacity: 0 }}
                    animate={active ? { opacity: 1 } : {}}
                    transition={{ delay: 0.55 + i * 0.1 }}
                  >
                    {node.label}
                  </motion.text>
                </g>
              </g>
            </g>
          );
        })}
      </g>

      <motion.circle r={36} fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth={16} animate={{ r: [36, 54, 36], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.circle cx={0} cy={0} fill="rgba(34,211,238,0.07)" stroke="rgba(34,211,238,0.45)" strokeWidth={1.5} animate={{ r: [36, 38, 36] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />
      <text textAnchor="middle" y={-5} fontSize={10} fontWeight={700} fill="rgba(255,255,255,0.82)" fontFamily="ui-monospace,monospace">VW</text>
      <text textAnchor="middle" y={8}  fontSize={6.5} fill="rgba(34,211,238,0.75)" fontFamily="ui-monospace,monospace">Group</text>
      <circle cx={26} cy={-26} r={8} fill="#3b82f6" />
      <text x={26} y={-23} textAnchor="middle" dominantBaseline="middle" fontSize={4.5} fontWeight={700} fill="white" fontFamily="sans-serif">B2B</text>
    </svg>
  );
}

function DetailPreview() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });

  return (
    <div ref={ref} className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="rounded-xl bg-orange-400/15 p-2">
            <Battery className="h-4 w-4 text-orange-400" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold leading-tight text-white">Battery Care Mode</p>
            <div className="mt-1 flex items-center gap-1">
              <span className="rounded-full bg-green-500/15 px-1.5 py-px text-[7px] font-bold text-green-400">● AVAILABLE</span>
              <span className="rounded-full bg-blue-500/15 px-1.5 py-px text-[7px] font-semibold text-blue-300">B2B</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(34,211,238,0.4)" }}
            className="shrink-0 rounded-lg bg-cyan-500/80 px-2.5 py-1.5 text-[9px] font-bold text-black"
          >
            ▶ Request
          </motion.button>
        </div>
      </div>

      <div className="min-h-0 flex-1 px-3 py-1">
        <OEMOrbital active={inView} />
      </div>

      <div className="shrink-0 grid grid-cols-4 divide-x divide-white/[0.05] border-t border-white/[0.05]">
        {[{ label: "Contract", value: "B2B" }, { label: "OEMs", value: "1" }, { label: "API", value: "v1" }, { label: "Status", value: "AVAILABLE" }].map(({ label, value }) => (
          <div key={label} className="px-3 py-2 text-center">
            <p className="font-mono text-[6.5px] uppercase tracking-widest text-white/22">{label}</p>
            <p className="mt-0.5 truncate text-[8px] font-bold text-white/60">{value}</p>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-white/[0.05] px-3 py-2.5">
        <div className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2">
          <code className="font-mono text-[9px] text-cyan-300/65">batterycaremode</code>
          <Copy className="h-3 w-3 text-white/22" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Card 3 — Shopping Cart
// ─────────────────────────────────────────────

function CartPreview() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const [items,   setItems]   = useState(CART_ITEMS);
  const [tab,     setTab]     = useState<"requests" | "orders">("requests");
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setItems(prev => prev.slice(0, -1)),           4200);
    const t2 = setTimeout(() => setItems(CART_ITEMS),                           6500);
    const t3 = setTimeout(() => { setOrdered(true); setItems([]); },           10500);
    const t4 = setTimeout(() => { setOrdered(false); setTab("orders"); },      13000);
    const t5 = setTimeout(() => { setTab("requests"); setItems(CART_ITEMS); }, 17000);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-cyan-300" />
          <span className="text-[12px] font-bold text-white">Shopping Bag</span>
          <AnimatePresence mode="wait">
            <motion.span key={items.length} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.2 }} className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 font-mono text-[8px] font-bold text-black">
              {items.length}
            </motion.span>
          </AnimatePresence>
        </div>
        <X className="h-3.5 w-3.5 text-white/28" />
      </div>

      <div className="flex shrink-0 border-b border-white/[0.06]">
        {(["requests", "orders"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn("flex-1 py-2 text-[9px] font-semibold transition-colors", tab === t ? "border-b-2 border-cyan-400 text-cyan-300" : "text-white/28 hover:text-white/50")}>
            {t === "requests" ? "My Requests" : "Orders"}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "requests" && (
            <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col">
              {ordered ? (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <Check className="h-5 w-5 text-green-400" />
                  </motion.div>
                  <p className="text-[11px] font-semibold text-white/65">Order placed!</p>
                  <p className="text-[9px] text-white/30">Saved to order history</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-[10px] text-white/25">Your bag is empty</p>
                </div>
              ) : (
                <>
                  <div className="min-h-0 flex-1 space-y-1.5 overflow-hidden px-3 py-2.5">
                    <AnimatePresence>
                      {items.map(item => (
                        <motion.div key={item.id} layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                          <div>
                            <p className="text-[9px] font-semibold text-white">{item.title}</p>
                            <p className="text-[8px] text-white/32">{item.price}</p>
                          </div>
                          <X className="h-3 w-3 text-white/22" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="shrink-0 border-t border-white/[0.05] px-3 pb-3 pt-2.5">
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="text-[9px] text-white/38">Total</span>
                      <span className="text-[12px] font-extrabold text-white">{items.length}.00 EUR</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(34,211,238,0.45)" }}
                      animate={{ boxShadow: ["0 0 0px rgba(34,211,238,0)", "0 0 22px rgba(34,211,238,0.35)", "0 0 0px rgba(34,211,238,0)"] }}
                      transition={{ boxShadow: { duration: 2.2, repeat: Infinity } }}
                      className="w-full rounded-xl bg-cyan-500 py-2.5 text-[10px] font-bold text-black"
                    >
                      Order All
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {tab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-white">Order #001</span>
                  <span className="text-[9px] font-semibold text-cyan-300">3.00 EUR</span>
                </div>
                <div className="mt-2 space-y-1">
                  {CART_ITEMS.map(item => (
                    <p key={item.id} className="text-[8px] text-white/35">· {item.title}</p>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <Clock className="h-2.5 w-2.5 text-white/20" />
                  <span className="text-[7px] text-white/20">just now</span>
                  <span className="ml-auto rounded-full bg-green-500/15 px-1.5 py-px text-[7px] font-bold text-green-400">COMPLETED</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────

const CARD_REVEAL = {
  hidden:  { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE_PREMIUM } },
};

const STAGGER = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

export function FeatureBentoGrid() {
  return (
    <section id="catalog" className="relative bg-ink px-6 py-28 text-white">
      <div className="mx-auto max-w-6xl">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Built for the way enterprises buy data.
          </h2>
          <p className="mt-4 text-white/50">
            Every feature engineered for security, speed, and a frictionless B2B checkout.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={STAGGER}
          className="grid h-[700px] grid-cols-1 gap-5 lg:grid-cols-4 lg:grid-rows-2"
        >

          {/* ── Product Catalog (col-span-3, row-span-2) ── */}
          <motion.div
            variants={CARD_REVEAL}
            whileHover={glowHover}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl lg:col-span-3 lg:row-span-2"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/8 blur-[80px]" />
            <div className="shrink-0 px-5 pt-4">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-cyan-300/55">Product Catalog</span>
              <h3 className="mt-0.5 text-xl font-extrabold tracking-tight">Discover &amp; Filter</h3>
              <p className="text-[11px] text-white/38">Fuzzy full-text search · 10 categories · OEM logos · live ticker · HTMX filters</p>
            </div>
            <div className="mx-5 mt-3 h-px shrink-0 bg-white/[0.06]" />
            <div className="min-h-0 flex-1 overflow-hidden">
              <CatalogPreview />
            </div>
          </motion.div>

          {/* ── Item Detail / OEM Orbital (col-span-1, row-span-1) ── */}
          <motion.div
            variants={CARD_REVEAL}
            whileHover={glowHover}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl lg:col-span-1 lg:row-span-1"
          >
            <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-blue-400/8 blur-[60px]" />
            <div className="shrink-0 px-5 pt-5">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-blue-300/55">Item Detail</span>
              <h3 className="mt-0.5 text-base font-extrabold tracking-tight">OEM Deep-Dive</h3>
              <p className="text-[10px] text-white/38">Orbital hub · Specs card · JSON Schema · Attributes</p>
            </div>
            <div className="mx-5 mt-3 h-px shrink-0 bg-white/[0.06]" />
            <div className="min-h-0 flex-1 overflow-hidden">
              <DetailPreview />
            </div>
          </motion.div>

          {/* ── Shopping Cart (col-span-1, row-span-1) ── */}
          <motion.div
            variants={CARD_REVEAL}
            whileHover={glowHover}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl lg:col-span-1 lg:row-span-1"
          >
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-purple-400/8 blur-[60px]" />
            <div className="shrink-0 px-5 pt-5">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-purple-300/55">Request System</span>
              <h3 className="mt-0.5 text-base font-extrabold tracking-tight">Shopping Cart</h3>
              <p className="text-[10px] text-white/38">localStorage persistence · UUID items · order history</p>
            </div>
            <div className="mx-5 mt-3 h-px shrink-0 bg-white/[0.06]" />
            <div className="min-h-0 flex-1 overflow-hidden">
              <CartPreview />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
