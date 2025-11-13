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
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'basic',
    // icon: 'heroicons_outline:chart-bar',
    link: '/area',
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
      // {
      //   id: 'gasbalance.bf',
      //   title: 'BF',
      //   type: 'basic',
      //   link: '/gasbalance/bf',
      // },
      // {
      //   id: 'gasbalance.sinter',
      //   title: 'Sinter',
      //   type: 'basic',
      //   link: '/gasbalance/sinter',
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

