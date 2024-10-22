export interface MainTest {
  id: number;
  main_test_name: string;
  pack_id: number;
  pageBreak: number;
  container_id: number;
  price: null | number;
  firstChildId: number;
  container: Container;
  child_tests: Childtest[];
}


export interface Childtest {
  id: number;
  child_test_name: string;
  low: null | number;
  upper: null | number;
  main_test_id: number;
  defval: string;
  unit_id: number;
  normalRange: string;
  max: string;
  lowest: string;
  test_order: null;
  child_group_id: null;
  unit: Unit;
  child_group: null;
}

export interface Unit {
  id: number;
  name: string;
}

export interface Container {
  id: number;
  container_name: string;
}

export interface LabPackage {
  package_id: number;
  package_name: string;
  container: string;
  exp_time: number;
  tests: MainTest[];
}



