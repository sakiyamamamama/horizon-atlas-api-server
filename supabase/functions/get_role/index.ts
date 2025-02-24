import "https://deno.land/std@0.217.0/dotenv/load.ts";

interface Role {
  id: string;
  name: string;
}

Deno.serve(async () => {
    const BOT_TOKEN = Deno.env.get("BOT_TOKEN")!;
    const guildId = '1022421169770594315';
    const guildInfoUrl = `https://discord.com/api/guilds/${guildId}/roles`;

    const guildRequestOptions = {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`
      }
    };
    const res = await fetch(guildInfoUrl, guildRequestOptions);

    // Discord API のレスポンスがエラーの場合の処理
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch roles: ${res.status} ${res.statusText}` }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const guildInfo: Role[] = await res.json();

    const basic_group = guildInfo.find(item => item.name === "基礎班");
    const dev_group = guildInfo.find(item => item.name === "発展班");

    if (!basic_group || !dev_group) {
      return new Response(
        JSON.stringify({ error: "Required roles not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = {
      basic: {
        id: basic_group.id,
        name: basic_group.name
      },
      develop: {
        id: dev_group.id,
        name: dev_group.name
      }
    };

    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } }
    );

});
