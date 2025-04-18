import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;
  console.log('API Route: Attempting to fetch document:', filename);

  try {
    // Try multiple backend endpoints
    const endpoints = [
      `${API_BASE_URL}/api/documents/view/${filename}`,
      `${API_BASE_URL}/api/documents/download/${filename}`,
      `${API_BASE_URL}/storage/documents/${filename}`
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log('Trying endpoint:', endpoint);
        
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/pdf,application/octet-stream,*/*',
          },
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type') || 'application/pdf';
          const blob = await response.blob();

          return new NextResponse(blob, {
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': 'inline',
              'Cache-Control': 'public, max-age=3600',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
          });
        }
      } catch (error) {
        console.warn('Failed to fetch from endpoint:', endpoint, error);
        lastError = error;
      }
    }

    throw lastError || new Error('Failed to fetch document from all endpoints');
  } catch (error) {
    console.error('Error in document view API route:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch document',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 