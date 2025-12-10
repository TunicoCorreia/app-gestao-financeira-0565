import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, plano } = await request.json();

    if (!email || !plano || !['mensal', 'anual'].includes(plano)) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    // Identificar ID do plano
    const planId = plano === 'mensal' ? process.env.KEOTO_PLAN_MENSAL_ID : process.env.KEOTO_PLAN_ANUAL_ID;

    // Simular requisição para Keoto API (substitua pela real)
    const keotoResponse = await fetch('https://api.keoto.com/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.KEOTO_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        plan_id: planId,
      }),
    });

    if (!keotoResponse.ok) {
      return NextResponse.json({ error: 'Falha ao criar checkout' }, { status: 500 });
    }

    const data = await keotoResponse.json();
    const checkoutUrl = data.checkout_url;

    return NextResponse.json({ checkout_url: checkoutUrl });
  } catch (error) {
    console.error('Erro ao criar checkout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}