import { AdminState, AuthState, CollectionsState } from '../redux/types'
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  auth: AuthState
  collections: CollectionsState
  admin: AdminState
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
