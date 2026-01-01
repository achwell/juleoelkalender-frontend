const CircularProgress = ({ value = 50, size = 24, thickness = 4, color = "text-blue-500" }) => {
    const radius = 50 - thickness;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className={`relative flex items-center justify-center w-${size} h-${size}`}>
            <svg
                className={`transform rotate-90 w-full h-full`}
                viewBox="0 0 120 120"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={thickness}
                    fill="transparent"
                    className="text-gray-200"
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={thickness}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={color}
                />
            </svg>
            <span className="absolute text-sm font-semibold">{`${value}%`}</span>
        </div>
    );
};

export default CircularProgress;
