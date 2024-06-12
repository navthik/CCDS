import serial

# Set up serial connection to NEO-6 module
ser = serial.Serial('/dev/ttyAMA0', 9600, timeout=1)

# Loop indefinitely, reading and printing GPS data
while True:
    # Read a line of data from the module
    try:
        line = ser.readline().decode('utf-8').strip()
    except UnicodeDecodeError:
        line = ser.readline().decode('iso-8859-1').strip()

    # Check if the line starts with $GPRMC (recommended minimum specific GPS/Transit data)
    if line.startswith('$GPRMC'):
        # Split the line into fields
        fields = line.split(',')
       # print(fields)

        # Check that the line has enough fields and that the status is valid
        if len(fields) >= 13 and fields[2] == 'A':
            # Extract latitude and longitude data
            latitude = float(fields[3][:2]) + float(fields[3][2:]) / 60.0
            if fields[4] == 'S':
                latitude = -latitude
            longitude = float(fields[5][:3]) + float(fields[5][3:]) / 60.0
            if fields[6] == 'W':
                longitude = -longitude

            # Print the latitude and longitude
            print(f'{latitude},{longitude}')
