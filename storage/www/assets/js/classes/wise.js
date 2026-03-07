/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                            
                                     |_|                                                                                                                

    Created with ♥ by the AtmosphericX Team (KiyoWx, StarflightWx, Everwatch1, & CJ Ziegler)
    Discord: https://atmosphericx-discord.scriptkitty.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

*/

class Wise { 
    constructor(utils = null) {
        this.name_space = `webmodule:wise`;
        this.utils = utils;
        this.storage = this.utils.storage;
        this.lastFetch = 0;
        this.subdomains = ['data', 'data1', 'data2'];
        this.directory = `https://{A}.weatherwise.app/radar/processed/{X}/{Y}/dir.list?_={Z}`;
        this.file = `https://{A}.weatherwise.app/radar/processed/{X}/{Y}/{Z}`;
        this.utils.log(`${this.name_space} initialized.`);
    }

    /**
     * @production
     * @function setBuffer
     * @description Sets the ArrayBuffer containing the WISE binary data.
     * 
     * @param {ArrayBuffer} buffer - The ArrayBuffer to set.
     */
    setBuffer = function(buffer) { 
        this.buffer = buffer;
    }

    /**
     * @production
     * @error_handling
     * @function headerSrc
     * @description 
     *      Reads and parses the header information from the WISE binary data.
     * 
     * @returns {Object} An object containing the parsed header information.
     */
    headerSrc = function() {
        try {
            const dataView = new DataView(this.buffer);
            let offset = 0;
            function readString(length) {
                let chars = [];
                for (let i = 0; i < length; i++) {
                    chars.push(String.fromCharCode(dataView.getUint8(offset++)));
                }
                return chars.join("");
            }
            function readUint8() {
                const value = dataView.getUint8(offset);
                offset += 1;
                return value;
            }
            function readUint32() {
                const value = dataView.getUint32(offset, false);
                offset += 4;
                return value;
            }
            function readFloat32() {
                const value = dataView.getFloat32(offset, false);
                offset += 4;
                return value;
            }
            const magic = readString(4);
            const version = readUint8();
            if (version !== 1) {
                throw new Error(`Unsupported WISE binary format version: ${version}`);
            }
            const flags = readUint8();
            const headerDataType = readUint8();
            readUint8();
            const headerDataLength = readUint32();
            const payloadLength = readUint32();
            const payloadBits = readUint8();
            readUint8();
            const payloadRangeMin = readFloat32();
            const payloadRangeMax = readFloat32();
            const dimX = readUint32();
            const dimY = readUint32();
            const dimZ = readUint32();
            for (let i = 0; i < 7; i++) readUint32();
            for (let i = 0; i < 2; i++) readUint8();
            return { magic, version, flags, headerLength: 68, headerDataType, headerDataLength, payloadLength, payloadBits, payloadRangeMin, payloadRangeMax, dimX, dimY, dimZ };
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:headerSrc`);
            return null;
        }
    }

    /**
     * @production
     * @error_handling
     * @function headerData
     * @description 
     *      Extracts and parses the header data from the WISE binary data.
     * 
     * @param {Object} header - The header object obtained from headerSrc().
     * @returns {Object|null} An object containing the parsed header data or null if unsupported type.
     */
    headerData = function(header) { 
        try {
            const dataView = new DataView(this.buffer);
            if (header.headerDataType === 0) {
                const rawHeaderData = new Uint8Array(dataView.buffer, 68, header.headerDataLength);
                const decodedString = new TextDecoder("utf-8").decode(rawHeaderData).trim();
                const parsedData = JSON.parse(decodedString);
                parsedData.dims = [header.dimX, header.dimY, header.dimZ];
                parsedData.range = {
                    min: header.payloadRangeMin,
                    max: header.payloadRangeMax
                };
                parsedData.precision = header.payloadBits;
                parsedData.flags = {
                    packed: (header.flags & 1) === 1,
                    fullPrecision: (header.flags & 2) !== 0
                };
                return parsedData;
            }
            return null;
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:headerData`);
            return null;
        }
    }

    /**
     * @production
     * @error_handling
     * @function unpack
     * @description 
     *      Unpacks the WISE binary data and returns the complete data object.
     * 
     * @returns {Object} An object containing the unpacked data.
     */
    unpack = function() {
        try {
            const header = this.headerSrc();
            const headerData = this.headerData(header);
            const payloadStart = 68 + header.headerDataLength;
            switch (header.payloadBits) {
                case 8:
                    headerData.data = new Uint8Array(this.buffer, payloadStart, header.payloadLength);
                    break;
                case 16:
                    headerData.data = new Uint16Array(this.buffer, payloadStart, header.payloadLength / Uint16Array.BYTES_PER_ELEMENT);
                    break;
                case 32:
                    headerData.data = new Uint32Array(this.buffer, payloadStart, header.payloadLength / Uint32Array.BYTES_PER_ELEMENT);
                    break;
            }
            return headerData;
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:unpack`);
            return null;
        }
    }

    /**
     * @production
     * @error_handling
     * @function getWiseLevels
     * @description 
     *      Converts WISE level data into geographical coordinates with associated values.
     * 
     * @param {Object} levelData - The WISE level data object obtained from unpack().
     * @returns {Array} An array of objects containing latitude, longitude, and dbz values.
     */
    getWiseLevels = function(levelData) {
        try {
            const { precision, range, dims: [rays, gates], data, location, meters_to_center_of_first_gate, meters_between_gates, azimuth_start } = levelData;
            const G = (1 << (precision - 1)) - 1;
            const degPerRay = 360 / rays;
            const output = [];
            let writeIndex = 0;
            for (let i = 0; i < data.length && writeIndex < rays * gates; i++) {
                const V = data[i];
                if (V > G) { writeIndex += V - G; continue; }
                const dbz = range.min + (V / G) * (range.max - range.min);
                const ray = Math.floor(writeIndex / gates);
                const gate = writeIndex % gates;
                const distance = meters_to_center_of_first_gate + (gate + 0.5) * meters_between_gates;
                const bearing = (azimuth_start + (ray + 0.5) * degPerRay) % 360;
                const [lon, lat] = this.utils.getEarthCoordinates(location[0], location[1], distance, bearing);
                output.push({ lat, lon, dbz });
                writeIndex++;
            }
            return output;
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:getWiseLevels`);
            return [];
        }
    }

    /**
     * @production
     * @error_handling
     * @function getAvailableSubdomain
     * @description 
     *      Checks which subdomain is available for the given URL.
     * 
     * @param {string} url - The URL to check.
     * @returns {Promise<string|null>} A promise that resolves to the available subdomain or null if none is available.
     */
    getAvailableSubdomain = async function(url) {
        for (const subdomain of this.subdomains) {
            const dirResponse = await this.utils.httpRequest(url.replace('{A}', subdomain)).catch(() => null);
            if (dirResponse) {
                console.log(`Found available subdomain: ${subdomain}`);
                return dirResponse;
            }
        }
        this.utils.exception(`No subdomain for weatherwise.app available`, `${this.name_space}`);
        return null;
    }

    /**
     * @production
     * @error_handling
     * @function fetchLatest
     * @description 
     *      Fetches the latest WISE data file for the specified ICAO and product codes.
     * 
     * @param {string} icao - The ICAO code of the radar station.
     * @param {string} product - The product code (e.g., REF0, VEL0).
     * @returns {Promise<Object|null>} A promise that resolves to the unpacked WISE data object or null if an error occurs.
     */
    fetchLatest = async function(icao = `KLOT`, product = `REF0`) {
        try {
            const now = Date.now();
            if (now - this.lastFetch < 60000) {
                return null;
            }
            this.lastFetch = now;
            const icaoCode    = icao.trim().toUpperCase();
            const productCode = product.trim().toUpperCase();
            const dirUrl = this.directory.replace('{X}', icaoCode).replace('{Y}', productCode).replace('{Z}', now)
            const dirResponse = await this.getAvailableSubdomain(dirUrl).catch(() => null);
            const dirText = await dirResponse.text();
            const files = dirText
                .trim().split('\n').map(l => l.trim())
                .filter(Boolean).filter(line => line.endsWith('.wise'));
            files.sort((a, b) => {
                const na = parseInt(a.match(/\d+/)?.[0] ?? 0, 10);
                const nb = parseInt(b.match(/\d+/)?.[0] ?? 0, 10);
                return na - nb;
            });
            const latestFile = files[files.length - 1];
            const fileUrl = this.file
                .replace('{X}', icaoCode)
                .replace('{Y}', productCode)
                .replace('{Z}', latestFile);
            const fileResponse = await this.getAvailableSubdomain(fileUrl).catch(() => null);
            const arrayBuffer = await fileResponse.arrayBuffer();
            this.setBuffer(arrayBuffer);
            const parsedData = this.unpack(true);
            return parsedData ?? null;
        } catch (error) {
            this.utils.exception(error, `${this.name_space}:fetchLatest`);
            return null;
        }
    }
}

