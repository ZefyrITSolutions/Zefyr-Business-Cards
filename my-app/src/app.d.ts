// src/global.d.ts

import { SupabaseClient, Session } from "@supabase/supabase-js";

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			supabase: SupabaseClient;
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		HSStaticMethods: {
			autoInit: () => void;
			Preline: {
				init: () => void;
			};
		};
	}
}

export { };
