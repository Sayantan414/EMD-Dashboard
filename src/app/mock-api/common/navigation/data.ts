/* eslint-disable */
import { FuseNavigationItem } from "@fuse/components/navigation";

export const defaultNavigation: FuseNavigationItem[] = [

  {
    id: "dashboards",
    title: "Dashboards",
    // subtitle: 'UPV',
    type: "group",
    icon: "heroicons_outline:home",
    // privilege: [
    //   "Blust Furnace",
    //   "Stove",
    //   "GCP & TRTG",
    //   "Sinter Plant",
    //   "Coke Ovens",
    //   "By Product Plant",
    //   "CDCP",
    //   "Coke Ovens #11 Complex",
    //   "BF Stock House",
    //   "Basic Oxygen Furnace",
    //   "Torpedo At HMRS",
    //   "Continuous Casting Plant",
    //   "Crane Ladle Weight",
    //   "Ladle Heating Furnace",
    //   "Mills",
    //   "Power & Blowing Station",
    //   "BOF Gas Holder",
    //   "Gas Utility",
    //   "Compressed Air Station",
    //   "Oxygen Plant",
    //   "LDCP",
    //   "CBM",
    //   "Techno Economics",
    //   "BF Stock House",
    //   "Lime & Dolo Calcination Plant",
    //   "Dashboard",
    //   "Critical Parameter",
    //   "Digital Dashboard",
    // ],
    features: ["Reports", "Settings", "Trends"],
    children: [

      {
        id: "settings.overview",
        title: "Overview",
        type: "basic",
        icon: "dashboard",
        link: "/overview",
        privilege: [

        ],
      },

    ],
  },


];
export const compactNavigation: FuseNavigationItem[] = [
  {
    id: "dashboards",
    title: "Dashboards",
    tooltip: "Dashboards",
    type: "aside",
    icon: "heroicons_outline:home",
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
];
export const futuristicNavigation: FuseNavigationItem[] = [
  {
    id: "dashboards",
    title: "DASHBOARDS",
    type: "group",
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
];
export const horizontalNavigation: FuseNavigationItem[] = [
  {
    id: "dashboards",
    title: "Dashboards",
    type: "group",
    icon: "heroicons_outline:home",
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
];

