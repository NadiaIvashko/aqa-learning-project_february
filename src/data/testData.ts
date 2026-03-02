export const TEST_DATA = {
  INSTANCES_TO_ADD: 2,
  EXPECTED_TOTAL_COST: '$201.03',

  MACHINE_TYPE_N4_STANDARD_4: 'n4-standard-4',
  MACHINE_TYPE_N4_STANDARD_16: 'n4-standard-16',
  MACHINE_TYPE_N4_HIGHMEM_8: 'n4-highmem-8',
  INSTANCES_COUNT: '2',
  BOOT_DISK_SIZE: '100',
  BOOT_DISK_SIZE2: '20',

  OS_UBUNTU_PRO: 'Ubuntu Pro',
  OS_RED_HAT: 'Paid: Red Hat Enterprise Linux',
  REGION_FRANKFURT: 'Frankfurt (europe-west3)',
  REGION_SALT_LAKE_CITY: 'Salt Lake City (us-west3)',
  EXPECTED_COST_N1_STANDARD_1: '$340.89',

  // Cloud Storage
  LOCATION_TYPE_DUAL_REGION: 'Dual-region (predefined)',
  LOCATION_TYPE_MULTI_REGION: 'Multi-region',
  LOCATION_TOKYO_OSAKA: 'Tokyo and Osaka (asia1)',
  LOCATION_INDONESIA: 'Indonesia',
  LOCATION_USA: 'United States (us)',
  STORAGE_CLASS_STANDARD: 'Standard Storage',
  STORAGE_CLASS_NEARLINE: 'Nearline Storage',
  STORAGE_AMOUNT: '5000',
  STORAGE_AMOUNT_SMALL: '100',
  MONTHLY_DATA_WRITTEN: '4',
  DATA_TRANSFER: '2',
  SOURCE_REGION_INDONESIA: 'Indonesia',
  DESTINATION_REGION_OCEANIA: 'Oceania',
} as const;
