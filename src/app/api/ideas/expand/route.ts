
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const n8nUrl = process.env.N8N_WEBHOOK_URL;

        if (!n8nUrl) {
            return NextResponse.json({ error: 'N8N_WEBHOOK_URL not configured' }, { status: 500 });
        }

        // Call n8n Webhook
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`n8n responded with ${response.status}`);
        }

        const data = await response.json().catch(() => ({ status: 'triggered' }));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Expansion Error:', error);
        // Determine the error message safely
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
