const mongoose = require('mongoose');
const dotenv = require('dotenv');
const RedemptionCode = require('./src/models/RedemptionCode');

dotenv.config();

const batch1Codes = [
    { serialNumber: 1, code: "END-QGWW-9HC" }, { serialNumber: 2, code: "END-LA7H-FSZ" }, { serialNumber: 3, code: "END-NL77-70S" }, { serialNumber: 4, code: "END-Q5K0-XV2" }, { serialNumber: 5, code: "END-EC9S-73Q" },
    { serialNumber: 6, code: "END-GD9I-SL6" }, { serialNumber: 7, code: "END-L42N-XDZ" }, { serialNumber: 8, code: "END-CWZN-WFS" }, { serialNumber: 9, code: "END-EYQS-XC9" }, { serialNumber: 10, code: "END-FPYN-NZM" },
    { serialNumber: 11, code: "END-OSQL-FEN" }, { serialNumber: 12, code: "END-L8QU-LZK" }, { serialNumber: 13, code: "END-F6AK-XEJ" }, { serialNumber: 14, code: "END-UARR-4DT" }, { serialNumber: 15, code: "END-GXYD-DM9" },
    { serialNumber: 16, code: "END-KJLL-DIU" }, { serialNumber: 17, code: "END-3BEQ-U83" }, { serialNumber: 18, code: "END-55FD-0H7" }, { serialNumber: 19, code: "END-0UK0-PIC" }, { serialNumber: 20, code: "END-HYT4-PWJ" },
    { serialNumber: 21, code: "END-O3ZA-WE7" }, { serialNumber: 22, code: "END-9KQX-8FQ" }, { serialNumber: 23, code: "END-NH79-AH1" }, { serialNumber: 24, code: "END-5NKP-PN5" }, { serialNumber: 25, code: "END-31YN-TPZ" },
    { serialNumber: 26, code: "END-ITSE-47S" }, { serialNumber: 27, code: "END-NASU-MJS" }, { serialNumber: 28, code: "END-K5BL-O4M" }, { serialNumber: 29, code: "END-1F7K-8GR" }, { serialNumber: 30, code: "END-1KRH-5CC" },
    { serialNumber: 31, code: "END-J1QN-ZUI" }, { serialNumber: 32, code: "END-2UMQ-MJM" }, { serialNumber: 33, code: "END-7ZWY-YMG" }, { serialNumber: 34, code: "END-BWLT-3S4" }, { serialNumber: 35, code: "END-MCFX-THD" },
    { serialNumber: 36, code: "END-KVZJ-UXP" }, { serialNumber: 37, code: "END-C8ZW-TPU" }, { serialNumber: 38, code: "END-J7AW-CKU" }, { serialNumber: 39, code: "END-FQF8-4D5" }, { serialNumber: 40, code: "END-F8LT-FEB" },
    { serialNumber: 41, code: "END-FIKY-E3Z" }, { serialNumber: 42, code: "END-ZKVW-KRK" }, { serialNumber: 43, code: "END-TVFZ-20S" }, { serialNumber: 44, code: "END-S7ND-PP8" }, { serialNumber: 45, code: "END-4B8B-858" },
    { serialNumber: 46, code: "END-HCXR-0DQ" }, { serialNumber: 47, code: "END-6JJJ-BDM" }, { serialNumber: 48, code: "END-U4ID-T8V" }, { serialNumber: 49, code: "END-RHU6-4DI" }, { serialNumber: 50, code: "END-GGJY-PXG" },
    { serialNumber: 51, code: "END-ZNF7-NSB" }, { serialNumber: 52, code: "END-2TW6-CZL" }, { serialNumber: 53, code: "END-8K8K-Q5V" }, { serialNumber: 54, code: "END-QGHA-BOD" }, { serialNumber: 55, code: "END-9W8I-UVZ" },
    { serialNumber: 56, code: "END-K4U6-IVU" }, { serialNumber: 57, code: "END-FOLY-GYT" }, { serialNumber: 58, code: "END-ANKS-737" }, { serialNumber: 59, code: "END-4AV8-QD0" }, { serialNumber: 60, code: "END-YC8U-M54" },
    { serialNumber: 61, code: "END-2AGA-4GL" }, { serialNumber: 62, code: "END-J3IZ-T21" }, { serialNumber: 63, code: "END-TNS4-69N" }, { serialNumber: 64, code: "END-4PS1-826" }, { serialNumber: 65, code: "END-2EGK-IJ7" },
    { serialNumber: 66, code: "END-W71K-HHN" }, { serialNumber: 67, code: "END-W9WB-KMA" }, { serialNumber: 68, code: "END-S4OY-F9P" }, { serialNumber: 69, code: "END-IJJD-4B2" }, { serialNumber: 70, code: "END-5I77-E02" },
    { serialNumber: 71, code: "END-E7ZD-5A2" }, { serialNumber: 72, code: "END-C8N7-D0E" }, { serialNumber: 73, code: "END-HG20-JUZ" }, { serialNumber: 74, code: "END-FGWI-3AP" }, { serialNumber: 75, code: "END-R2DH-5BE" },
    { serialNumber: 76, code: "END-JGZZ-16W" }, { serialNumber: 77, code: "END-656M-BC7" }, { serialNumber: 78, code: "END-GL01-5WG" }, { serialNumber: 79, code: "END-H11L-IDU" }, { serialNumber: 80, code: "END-GX54-RP1" },
    { serialNumber: 81, code: "END-KD83-F5F" }, { serialNumber: 82, code: "END-WNQX-I80" }, { serialNumber: 83, code: "END-ME0O-YE5" }, { serialNumber: 84, code: "END-4Q9T-1EC" }, { serialNumber: 85, code: "END-BAGH-0UN" },
    { serialNumber: 86, code: "END-4A7D-YFA" }, { serialNumber: 87, code: "END-RNW5-BEN" }, { serialNumber: 88, code: "END-3R44-D65" }, { serialNumber: 89, code: "END-4HNP-CM4" }, { serialNumber: 90, code: "END-WV6P-1Y5" },
    { serialNumber: 91, code: "END-IUI7-6BC" }, { serialNumber: 92, code: "END-KWIW-UPK" }, { serialNumber: 93, code: "END-2A35-UOJ" }, { serialNumber: 94, code: "END-74LC-IIX" }, { serialNumber: 95, code: "END-IVYU-5VU" },
    { serialNumber: 96, code: "END-YY9P-OTV" }, { serialNumber: 97, code: "END-GTPM-YRJ" }, { serialNumber: 98, code: "END-DJY7-1Y0" }, { serialNumber: 99, code: "END-SQGI-ZB4" }, { serialNumber: 100, code: "END-VE7Y-8ZP" }
];

const batch2Codes = [
    { serialNumber: 1, code: "END-3L72-YJH" }, { serialNumber: 2, code: "END-K62T-LUO" }, { serialNumber: 3, code: "END-WJ4M-ZMB" }, { serialNumber: 4, code: "END-XET7-1EH" }, { serialNumber: 5, code: "END-98GB-XK2" },
    { serialNumber: 6, code: "END-9T1C-VU7" }, { serialNumber: 7, code: "END-RO33-N84" }, { serialNumber: 8, code: "END-KRVD-CK1" }, { serialNumber: 9, code: "END-B99H-03C" }, { serialNumber: 10, code: "END-6RXW-S44" },
    { serialNumber: 11, code: "END-P2C8-1SK" }, { serialNumber: 12, code: "END-9FE0-A13" }, { serialNumber: 13, code: "END-A1TY-NTN" }, { serialNumber: 14, code: "END-0JSC-9FO" }, { serialNumber: 15, code: "END-I1XD-LW9" },
    { serialNumber: 16, code: "END-O6Y7-LYB" }, { serialNumber: 17, code: "END-K0YG-L9Z" }, { serialNumber: 18, code: "END-WZLE-QMG" }, { serialNumber: 19, code: "END-C8AK-I3I" }, { serialNumber: 20, code: "END-IMHE-CQJ" },
    { serialNumber: 21, code: "END-3X55-2IG" }, { serialNumber: 22, code: "END-8TSV-042" }, { serialNumber: 23, code: "END-5MGN-QFY" }, { serialNumber: 24, code: "END-MEMM-NK7" }, { serialNumber: 25, code: "END-CPOK-CBM" },
    { serialNumber: 26, code: "END-20VN-G5M" }, { serialNumber: 27, code: "END-NQJ5-7W1" }, { serialNumber: 28, code: "END-ZOPA-2LY" }, { serialNumber: 29, code: "END-D5CW-RHD" }, { serialNumber: 30, code: "END-3SW3-2PD" },
    { serialNumber: 31, code: "END-A9VG-QJ4" }, { serialNumber: 32, code: "END-F204-L9Y" }, { serialNumber: 33, code: "END-CTAU-FZ6" }, { serialNumber: 34, code: "END-R4PX-3G4" }, { serialNumber: 35, code: "END-8HGE-OVU" },
    { serialNumber: 36, code: "END-NC7J-S8R" }, { serialNumber: 37, code: "END-R8O3-CG2" }, { serialNumber: 38, code: "END-66BP-L3R" }, { serialNumber: 39, code: "END-C65S-HYC" }, { serialNumber: 40, code: "END-3CAD-THU" },
    { serialNumber: 41, code: "END-0NBX-5QQ" }, { serialNumber: 42, code: "END-0JBU-HPF" }, { serialNumber: 43, code: "END-RNHV-BQF" }, { serialNumber: 44, code: "END-S4Y7-OOY" }, { serialNumber: 45, code: "END-NV96-F8U" },
    { serialNumber: 46, code: "END-NABM-JJV" }, { serialNumber: 47, code: "END-GKKN-S2K" }, { serialNumber: 48, code: "END-C4XN-XDI" }, { serialNumber: 49, code: "END-XYSJ-RXW" }, { serialNumber: 50, code: "END-C8BE-8DB" },
    { serialNumber: 51, code: "END-161S-MQY" }, { serialNumber: 52, code: "END-844N-YUE" }, { serialNumber: 53, code: "END-P75Q-WCT" }, { serialNumber: 54, code: "END-5NAC-0IH" }, { serialNumber: 55, code: "END-2B03-E6H" },
    { serialNumber: 56, code: "END-YVI2-Y18" }, { serialNumber: 57, code: "END-REKY-QR4" }, { serialNumber: 58, code: "END-ODL8-OYT" }, { serialNumber: 59, code: "END-R22M-VIS" }, { serialNumber: 60, code: "END-ZT3V-IFD" },
    { serialNumber: 61, code: "END-0PDT-DJI" }, { serialNumber: 62, code: "END-S184-BZF" }, { serialNumber: 63, code: "END-AFCQ-EVC" }, { serialNumber: 64, code: "END-1M8F-E73" }, { serialNumber: 65, code: "END-8Q9C-H6B" },
    { serialNumber: 66, code: "END-525D-QOS" }, { serialNumber: 67, code: "END-IX9C-O90" }, { serialNumber: 68, code: "END-NCSY-XYV" }, { serialNumber: 69, code: "END-G7L2-YPT" }, { serialNumber: 70, code: "END-VISY-6H9" },
    { serialNumber: 71, code: "END-VXIS-TFI" }, { serialNumber: 72, code: "END-7U7B-VSJ" }, { serialNumber: 73, code: "END-QG2W-GPM" }, { serialNumber: 74, code: "END-CPPQ-NKY" }, { serialNumber: 75, code: "END-18CF-FKJ" },
    { serialNumber: 76, code: "END-7X9M-HIM" }, { serialNumber: 77, code: "END-F19R-NF5" }, { serialNumber: 78, code: "END-OVAK-4EF" }, { serialNumber: 79, code: "END-72CG-MDK" }, { serialNumber: 80, code: "END-HTAD-WP3" },
    { serialNumber: 81, code: "END-MHN5-DYY" }, { serialNumber: 82, code: "END-CRMK-EQ1" }, { serialNumber: 83, code: "END-6XQ1-PIG" }, { serialNumber: 84, code: "END-M26W-JQL" }, { serialNumber: 85, code: "END-F7H6-F3Z" },
    { serialNumber: 86, code: "END-BIYZ-R0S" }, { serialNumber: 87, code: "END-KEVO-QER" }, { serialNumber: 88, code: "END-LQ15-8VA" }, { serialNumber: 89, code: "END-R32E-PRO" }, { serialNumber: 90, code: "END-2WIR-X2J" },
    { serialNumber: 91, code: "END-L5VV-13C" }, { serialNumber: 92, code: "END-CWGU-SUB" }, { serialNumber: 93, code: "END-K0X2-3AM" }, { serialNumber: 94, code: "END-4AYO-QT1" }, { serialNumber: 95, code: "END-JXDX-PWX" },
    { serialNumber: 96, code: "END-CCG8-WNV" }, { serialNumber: 97, code: "END-O4NV-PI1" }, { serialNumber: 98, code: "END-BX55-MPR" }, { serialNumber: 99, code: "END-5NCQ-C8R" }, { serialNumber: 100, code: "END-ZS89-DRO" }
];

const seedAllBatches = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/endura_prod');
        console.log('Connected to DB');

        await RedemptionCode.deleteMany({});
        console.log('Cleared existing protocols');

        const image1 = '/images/BLACK TSHIRT DC.png';
        const image2 = '/images/BLUE TSHIRT DC.png';

        const finalCodes = [
            ...batch1Codes.map(c => ({ ...c, batchId: 1, image: image1 })),
            ...batch2Codes.map(c => ({ ...c, batchId: 2, image: image2 }))
        ];

        await RedemptionCode.insertMany(finalCodes);
        console.log(`Successfully seeded ${finalCodes.length} codes across 2 batches.`);

        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedAllBatches();
