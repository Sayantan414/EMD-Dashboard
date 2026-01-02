/* eslint-disable */
import { FuseNavigationItem } from "@fuse/components/navigation";

export const horizontalNavigation: FuseNavigationItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    type: 'basic',
    // icon: 'heroicons_outline:chart-bar',
    link: '/overview',
  },
  // {
  //   id: 'dashboard',
  //   title: 'Dashboard',
  //   type: 'basic',
  //   // icon: 'heroicons_outline:chart-bar',
  //   link: '/area',
  // },

  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'collapsable',
    children: [
      {
        id: 'dashboard.cob',
        title: 'COB',
        type: 'basic',
        link: '/area',
        classes: { wrapper: 'nav-item-cog' }
      },
      {
        id: 'dashboard.gas_holder',
        title: 'Gas Holder',
        type: 'basic',
        link: '/gasutility/gas_holder',
        queryParams: { from: 'dashboard' },
        classes: { wrapper: 'nav-item-cog' }
      }
    ]
  },
  


  {
    id: 'gasbalance',
    title: 'Gas_Balance',
    type: 'collapsable',
    // icon: 'heroicons_outline:beaker',
    children: [
      {
        id: 'gasbalance.cog',
        title: 'COG',
        type: 'basic',
        link: '/gasbalance/cob11',
        classes: { wrapper: 'nav-item-cog' }
      },
      {
        id: 'gasbalance.cbm',
        title: 'CBM',
        type: 'basic',
        link: '/gasbalance/cbm',
        classes: { wrapper: 'nav-item-cog' }
      },
      {
        id: 'gasbalance.bf',
        title: 'BF',
        type: 'basic',
        link: '/gasbalance/bf',
        classes: { wrapper: 'nav-item-cog' }
      },
      {
        id: 'gasbalance.bofg',
        title: 'BOFG',
        type: 'basic',
        link: '/gasbalance/bofg',
        classes: { wrapper: 'nav-item-cog' }
      },
    ],
  },
  {
    id: 'gasutility',
    title: 'Gas_Utility',
    type: 'collapsable',
    // icon: 'heroicons_outline:beaker',
    children: [
      {
        id: 'gasutility.gas_holder',
        title: 'Gas Holder',
        type: 'basic',
        link: '/gasutility/gas_holder',
        classes: { wrapper: 'nav-item-cog' }
      },
      // {
      //   id: 'gasbalance.cbm',
      //   title: 'CBM',
      //   type: 'basic',
      //   link: '/gasbalance/cbm',
      //   classes: { wrapper: 'nav-item-cog' }
      // },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    type: 'basic',
    // icon: 'heroicons_outline:document-report',
    link: '/settings',
  },
];



export const defaultNavigation: FuseNavigationItem[] = [

  {
    id: "dashboards",
    title: "Dashboards",
    type: "group",
    icon: "heroicons_outline:home",
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
/* eslint-disable */

