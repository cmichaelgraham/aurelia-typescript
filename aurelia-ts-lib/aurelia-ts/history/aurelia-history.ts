export class History {
  activate(){
    throw new Error('History must implement activate().');
  }

  deactivate(){
    throw new Error('History must implement deactivate().');
  }

  navigate() {
    throw new Error('History must implement navigate().');
  }

  navigateBack() {
    throw new Error('History must implement navigateBack().');
  }
}