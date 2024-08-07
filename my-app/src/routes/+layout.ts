import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";
import type { LayoutLoad } from "./$types";

export const ssr = false;

export const load: LayoutLoad = async ({ fetch, data, depends }: any) => {
    depends('supabase:auth');

    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
            fetch
        },
        cookies: {
            get(key: string) {
                if (!isBrowser()) {
                    return JSON.stringify(data.session);
                }

                const cookie = parse(document.cookie);
                return cookie[key];
            },
            set(key: string, value: string) {
                if (isBrowser()) {
                    document.cookie = `${key}=${value}; path=/`;
                }
                // Implement server-side cookie setting if needed
            },
            remove(key: string) {
                if (isBrowser()) {
                    document.cookie = `${key}=; Max-Age=0; path=/`;
                }
                // Implement server-side cookie removal if needed
            }
        }
    });

    const {
        data: { session }
    } = await supabase.auth.getSession();

    return { supabase, session };
};


