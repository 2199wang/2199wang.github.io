/* 心动回响 · 暗恋信号数据层 */
window.CRUSH_DATA = (() => {
  const personaOrder = [
    'gaze',
    'trace',
    'orbit',
    'retract',
    'friend',
    'tease',
    'midnight',
    'direct',
    'cool',
    'archive'
  ];

  const personas = {
    gaze: {
      id: 'gaze',
      no: '01',
      name: '余光惯犯',
      en: 'EYE CONTACT CRIMINAL',
      color: '#FF4D7D',
      tagline: '你的喜欢，都藏在不敢对视的那一秒里。',
      tags: ['偷看十级', '表面淡定', '视线追踪'],
      keywords: ['#余光惯犯', '#偷看十级', '#表面淡定'],
      desc: '你可以一整天不和Ta说话，却能在人群里精准定位Ta。你的余光比导航还准，但只要Ta真的看过来，你会立刻低头，假装在看手机。',
      habit: 'Ta一看过来，你就刚好低头；Ta一转身，你又开始找Ta。',
      inner: '只要我不说，就不算输。',
      taView: 'Ta可能觉得你有点冷，或者根本没发现，你的余光一直在Ta身上。',
      move: '下次Ta看向你时，别急着躲。多停半秒，让Ta看见你。',
      trap: '你把“没被发现”当成“没被拒绝”，然后一直停在原地。',
      bias: '你容易把Ta偶然的一次对视，反复回放成心动证据。',
      quote: '“我不是在看你。我是在确认，你会不会也看我。”'
    },
    trace: {
      id: 'trace',
      no: '02',
      name: '痕迹侦探',
      en: 'TRACE DETECTIVE',
      color: '#7B61FF',
      tagline: '你谈恋爱的第一步，是成为Ta的互联网考古学家。',
      tags: ['主页考古', '细节控', '暗中观察'],
      keywords: ['#痕迹侦探', '#主页考古', '#细节控'],
      desc: '从Ta的点赞列表到三年前的动态，你能把公开信息拼成一份心动档案。你比Ta自己还清楚Ta最近在听什么、去哪里、心情好不好。',
      habit: '记住Ta点赞过哪首歌，然后偷偷加入自己的歌单。',
      inner: '我不是视奸，我是在收集证据。',
      taView: 'Ta可能完全不知道，你比Ta自己还了解Ta的生活。',
      move: '把线上线索变成一次真实的对话，比如问Ta那首歌。',
      trap: '你越了解Ta的线上生活，越不敢参与Ta的真实生活。',
      bias: '你把Ta的每一条动态，都当成只给你的暗号。',
      quote: '“你随手发的动态，是我研究很久的线索。”'
    },
    orbit: {
      id: 'orbit',
      no: '03',
      name: '偶遇导演',
      en: 'COINCIDENCE DIRECTOR',
      color: '#FF8A3D',
      tagline: '所有巧合，都是你提前写好的剧本。',
      tags: ['制造相遇', '路线规划', '假装路过'],
      keywords: ['#偶遇导演', '#制造相遇', '#假装路过'],
      desc: '你研究Ta的课表、路线、常去的店，然后让“刚好”发生。你表面说好巧，心里已经排练了十遍。',
      habit: '提前十分钟到Ta常出现的路口，假装刚到。',
      inner: '如果缘分不来找我，我就自己去制造缘分。',
      taView: 'Ta可能真的觉得你们很有缘，也可能早就看穿了你的小心思。',
      move: '下次别只制造偶遇，试着主动约一次明确的见面。',
      trap: '你太会安排相遇，却很少安排“说出喜欢”。',
      bias: '你把每一次偶遇都当成命运，而Ta可能只是刚好路过。',
      quote: '“这世上哪有那么多刚好。是我在等你。”'
    },
    retract: {
      id: 'retract',
      no: '04',
      name: '撤回大师',
      en: 'UNSEND EXPERT',
      color: '#5D8BFF',
      tagline: '你发出去的每一句话，都先在心里死过一次。',
      tags: ['打了又删', '欲言又止', '自我保护'],
      keywords: ['#撤回大师', '#打了又删', '#欲言又止'],
      desc: '你在聊天框里反复删改，发出去又撤回；想说的喜欢，最后都变成了“没事”。你不是不想靠近，你只是太怕被看穿。',
      habit: '发一条“在吗”，等三分钟没人回就撤回。',
      inner: '如果我先撤回，就没人知道我有多在意。',
      taView: 'Ta可能觉得你忽冷忽热，不知道你其实紧张得要命。',
      move: '下次发出去就别撤回，让Ta看见真实的你。',
      trap: '你把保护自己，变成了推开对方。',
      bias: '你容易把Ta的迟回，理解成不感兴趣。',
      quote: '“我撤回的不是消息。是我差点说出口的真心。”'
    },
    friend: {
      id: 'friend',
      no: '05',
      name: '友情区钉子户',
      en: 'FRIEND ZONE SQUATTER',
      color: '#2FBFA0',
      tagline: '你以朋友的名义，住在离Ta最近的地方。',
      tags: ['友情以上', '默默守护', '不敢越界'],
      keywords: ['#友情区钉子户', '#友情以上', '#默默守护'],
      desc: '你听Ta讲喜欢的人，帮Ta分析感情，嘴上说“我帮你”，心里说“看看我”。你害怕越界，又舍不得离开。',
      habit: '记得Ta所有喜好，却从不承认自己特别在意。',
      inner: '朋友至少不会失去，恋人可能会。',
      taView: 'Ta可能把你当成最信任的人，也可能习惯了你的好。',
      move: '偶尔让Ta看见你“不是朋友”的那一面。',
      trap: '你把自己放得太安全，Ta就真的只把你当朋友。',
      bias: '你把Ta的依赖当成喜欢，可依赖和心动是两件事。',
      quote: '“我以朋友的身份，爱了你很久。”'
    },
    tease: {
      id: 'tease',
      no: '06',
      name: '阴阳试探师',
      en: 'TEASE TESTER',
      color: '#F4B63F',
      tagline: '你用玩笑说真心，用吃醋试探答案。',
      tags: ['反话十级', '试探大师', '嘴硬心软'],
      keywords: ['#阴阳试探师', '#反话十级', '#嘴硬心软'],
      desc: '你不敢直接问“你喜不喜欢我”，于是说“你最近桃花很旺啊”。Ta一笑而过，你却在心里演完一整部分手戏。',
      habit: '假装随口问Ta的理想型，然后逐条对照自己。',
      inner: '我问得漫不经心，其实每个字都在等一个答案。',
      taView: 'Ta可能觉得你很有趣，也可能被你的反话弄糊涂。',
      move: '把一次玩笑换成一句认真但不沉重的表达。',
      trap: '试探太多，会让真心听起来像挑衅。',
      bias: '你把Ta的玩笑回应，当成拒绝，也可能当成暧昧。',
      quote: '“我开玩笑的。可如果你当真，我会很开心。”'
    },
    midnight: {
      id: 'midnight',
      no: '07',
      name: '深夜小作文家',
      en: 'MIDNIGHT ESSAYIST',
      color: '#8C6BFF',
      tagline: '白天你没事，晚上你写完了和Ta的一生。',
      tags: ['脑内小剧场', '深夜 emo', '高敏感'],
      keywords: ['#深夜小作文家', '#脑内小剧场', '#深夜emo'],
      desc: '你会在凌晨反复回放白天的一句话，分析语气、标点、表情包。你写了很多没发出去的小作文，也删了很多仅Ta可见的动态。',
      habit: '半夜编辑一条仅Ta可见的朋友圈，天亮前删掉。',
      inner: '我不是想太多，我只是太想弄明白。',
      taView: 'Ta可能只觉得你有点安静，完全不知道你心里下了多少场雨。',
      move: '把一篇小作文，压缩成一句白天能说出口的话。',
      trap: '你在脑内完成了所有剧情，却忘了邀请Ta参演。',
      bias: '你最容易把“没有回应”解读成“Ta不喜欢我”。',
      quote: '“我写了三百字。最后只发了一个晚安。”'
    },
    direct: {
      id: 'direct',
      no: '08',
      name: '直球预备役',
      en: 'DIRECT RESERVE',
      color: '#FF5C5C',
      tagline: '你什么都准备好了，就差一个不会输的信号。',
      tags: ['想打直球', '草稿三版', '等一个绿灯'],
      keywords: ['#直球预备役', '#想打直球', '#等一个绿灯'],
      desc: '你不想再猜了。你想表白，想牵手，想把关系说清楚，但每次临门一脚，又开始找“再等等”的理由。',
      habit: '在备忘录里写过三版告白草稿。',
      inner: '给我一个信号，我就敢走向你。',
      taView: 'Ta可能感觉到你的靠近，但不确定你是不是认真的。',
      move: '不用等完美信号，先约一次只有你们两个人的见面。',
      trap: '你一直在等一个不会失败的时刻，但喜欢本来就有风险。',
      bias: '你容易把Ta的一次热情，当成可以表白的绿灯。',
      quote: '“我不缺勇气。我缺一个你也喜欢我的证据。”'
    },
    cool: {
      id: 'cool',
      no: '09',
      name: '装不在意冠军',
      en: 'COOL PRETENDER',
      color: '#5A6B8C',
      tagline: '你嘴上说随便，心里已经排练了一百遍。',
      tags: ['口是心非', '表面冷淡', '偷偷在意'],
      keywords: ['#装不在意冠军', '#口是心非', '#表面冷淡'],
      desc: '你回复得很慢，语气很淡，朋友圈也不提Ta。可只要Ta一句话，你就能开心一整天。你最擅长把在乎演成不在乎。',
      habit: '明明秒看到消息，却故意隔十分钟再回。',
      inner: '谁先认真，谁就输了。',
      taView: 'Ta可能真的以为你不在意，于是也不敢靠近。',
      move: '让Ta看到一次你的主动，不用多，一次就够。',
      trap: '你赢了口是心非，却可能输掉本来可以开始的关系。',
      bias: '你把Ta的退缩，当成自己“装得好”的证明。',
      quote: '“我没有很想你。只是每隔十分钟就看一次手机。”'
    },
    archive: {
      id: 'archive',
      no: '10',
      name: '聊天记录考古学家',
      en: 'CHAT ARCHAEOLOGIST',
      color: '#C66BFF',
      tagline: '你把聊天记录，读成了你们的关系史。',
      tags: ['记录考古', '标点分析', '反复回看'],
      keywords: ['#聊天记录考古学家', '#记录考古', '#标点分析'],
      desc: '你会反复看Ta的每一句回复，研究回复速度、表情包、标点。你甚至记得Ta哪天多打了一个“哈”。',
      habit: '截图保存Ta说过的暧昧话，反复放大看。',
      inner: 'Ta这句话，是不是有一点喜欢我？',
      taView: 'Ta可能只是随手回了一句，不知道你已经在心里开了研讨会。',
      move: '别再考古了，直接创造一条新的聊天记录。',
      trap: '你太擅长分析过去，却不敢推进现在。',
      bias: '你容易把Ta的礼貌回复，当成暧昧证据。',
      quote: '“你只是回了一个‘哈哈’。我分析了一晚上。”'
    }
  };

  const dimensions = {
    initiative: {
      id: 'initiative',
      name: '主动靠近',
      en: 'INITIATIVE',
      color: '#FF4D7D',
      desc: 'Ta是否会主动开启对话、提出见面。',
      strong: 'Ta主动靠近你的频率，已经超过了普通朋友。',
      weak: 'Ta很少主动，不代表不喜欢，也可能只是习惯了等你开口。'
    },
    attention: {
      id: 'attention',
      name: '关注细节',
      en: 'ATTENTION',
      color: '#F4B63F',
      desc: 'Ta是否记得关于你的小事。',
      strong: 'Ta在认真听你说话，也在记住你。',
      weak: 'Ta可能不是不关注你，只是不擅长记住细节。'
    },
    special: {
      id: 'special',
      name: '特殊对待',
      en: 'SPECIAL',
      color: '#8C6BFF',
      desc: '你是否被Ta放在了不一样的位置。',
      strong: '你在Ta那里，确实有一点不一样。',
      weak: '目前还看不出明显的区别对待，别急着把礼貌当偏爱。'
    },
    body: {
      id: 'body',
      name: '身体语言',
      en: 'BODY SIGNAL',
      color: '#2FBFA0',
      desc: '眼神、距离和那些下意识的动作。',
      strong: 'Ta的身体比嘴巴更早暴露了心意。',
      weak: 'Ta在你面前可能比较克制，身体语言不是唯一的答案。'
    },
    emotion: {
      id: 'emotion',
      name: '情绪回响',
      en: 'EMOTIONAL ECHO',
      color: '#FF6FAE',
      desc: 'Ta的情绪是否会被你牵动。',
      strong: 'Ta的情绪，会跟着你轻轻晃动。',
      weak: 'Ta的情绪看起来比较稳定，也可能只是还没在你面前放松。'
    }
  };

  const dimensionOrder = ['initiative', 'attention', 'special', 'body', 'emotion'];

  const stages = [
    { id: 'classmate', label: '同学 / 同事', en: 'SAME SPACE', note: '你们有足够多的日常，让喜欢藏进每一次擦肩。' },
    { id: 'friend', label: '朋友', en: 'FRIENDS', note: '朋友是最安全的距离，也最容易让心动变得模糊。' },
    { id: 'online', label: '网友', en: 'ONLINE', note: '隔着屏幕的心动，最容易被想象放大。' },
    { id: 'crush', label: '暧昧中', en: 'SOMETHING MORE', note: '你们已经走到暧昧的门口，只差有人推门。' },
    { id: 'unsure', label: '说不清', en: 'UNLABELED', note: '关系还没有名字，答案也还在路上。' }
  ];

  const questions = [
    {
      part: 1,
      q: '暗恋一个人时，你最常做的第一件事是？',
      hint: '选最像你的那个，不是最体面的那个。',
      options: [
        { text: '在人群里用余光找Ta', type: 'gaze' },
        { text: '点开Ta的主页，从最新翻到最早', type: 'trace' },
        { text: '算好时间，制造一次“刚好”遇见', type: 'orbit' },
        { text: '在聊天框里打了又删，最后没发', type: 'retract' }
      ]
    },
    {
      part: 1,
      q: 'Ta发来一句“在干嘛”，你会？',
      hint: '第一反应通常最诚实。',
      options: [
        { text: '认真回完，顺势问TA的近况', type: 'friend' },
        { text: '回一句“在想你啊”，用玩笑试探', type: 'tease' },
        { text: '盯着这句话想半小时，猜TA是不是想你了', type: 'midnight' },
        { text: '直接回“在等你”，不绕弯', type: 'direct' }
      ]
    },
    {
      part: 1,
      q: '你会怎么保存关于Ta的记忆？',
      hint: '有些喜欢，藏在你的收藏夹里。',
      options: [
        { text: '嘴上说“谁记得啊”，其实每个细节都没忘', type: 'cool' },
        { text: '反复翻聊天记录，连标点都记得', type: 'archive' },
        { text: '记得Ta那天穿什么、坐在哪、看了你几眼', type: 'gaze' },
        { text: '截图Ta发过的动态，存进隐藏相册', type: 'trace' }
      ]
    },
    {
      part: 1,
      q: '看到Ta和别人聊得很开心，你会？',
      hint: '吃醋不一定是发脾气。',
      options: [
        { text: '找个理由走过去，加入你们', type: 'orbit' },
        { text: '突然不想说话了，默默退出这场热闹', type: 'retract' },
        { text: '装作路过，顺便递个东西给Ta', type: 'friend' },
        { text: '半开玩笑来一句“你们聊得挺投机啊”', type: 'tease' }
      ]
    },
    {
      part: 1,
      q: '如果今晚可以收到Ta的一条消息，你最想看到？',
      hint: '别想太久，选你心里最先冒出来的那句。',
      options: [
        { text: '“睡了吗？今天突然想到你。”', type: 'midnight' },
        { text: '“明天有空吗？想见你。”', type: 'direct' },
        { text: '“没什么事，就是看看你在不在。”', type: 'cool' },
        { text: '一条回复你三天前那句话的消息', type: 'archive' }
      ]
    },
    {
      part: 1,
      q: '你和Ta在同一个场合，你通常会？',
      hint: '身体比嘴更早知道喜欢谁。',
      options: [
        { text: '不主动说话，但知道Ta在哪个方向', type: 'gaze' },
        { text: '找机会坐到Ta附近', type: 'orbit' },
        { text: '以朋友身份自然地和Ta搭话', type: 'friend' },
        { text: '故意和别人聊得更开心，等Ta看过来', type: 'cool' }
      ]
    },
    {
      part: 1,
      q: '你会怎么处理那些没说出口的话？',
      hint: '那些没发出去的内容，也算数。',
      options: [
        { text: '把Ta的点赞、歌单、动态反复研究，试图找到答案', type: 'trace' },
        { text: '发出去又撤回，假装什么都没发生', type: 'retract' },
        { text: '用玩笑问Ta“你是不是喜欢我”，然后说“我开玩笑的”', type: 'tease' },
        { text: '凌晨写一大段话，天亮前删掉', type: 'midnight' }
      ]
    },
    {
      part: 1,
      q: '如果Ta主动靠近你，你的第一反应是？',
      hint: '想象一下Ta真的向你走过来。',
      options: [
        { text: '顺势把话题聊深，甚至约下一次', type: 'direct' },
        { text: '回去反复回味这次互动，截图保存', type: 'archive' },
        { text: '先低头或躲开视线，等心跳慢下来', type: 'gaze' },
        { text: '立刻开始想下一次怎么再见到Ta', type: 'orbit' }
      ]
    },
    {
      part: 1,
      q: '你手机里最舍不得删的东西是？',
      hint: '你的喜欢，可能藏在一个很具体的地方。',
      options: [
        { text: 'Ta发过的一张照片，或一条动态截图', type: 'trace' },
        { text: '你们作为朋友的聊天记录', type: 'friend' },
        { text: '对话框里那几条没发出去的草稿', type: 'retract' },
        { text: '什么都没有，但我记得Ta说过的每句话', type: 'cool' }
      ]
    },
    {
      part: 1,
      q: '如果有人问你“你是不是喜欢Ta”，你会？',
      hint: '最后一题，诚实一点。',
      options: [
        { text: '笑着说“你猜”，然后观察Ta的反应', type: 'tease' },
        { text: '说“没有啦”，晚上继续一个人想', type: 'midnight' },
        { text: '认真地说“是”，不想再藏了', type: 'direct' },
        { text: '反问“你觉得Ta喜欢我吗”，开始分析', type: 'archive' }
      ]
    },
    {
      part: 2,
      dimension: 'initiative',
      q: 'Ta会主动找你聊天吗？',
      hint: '想想最近一个月，而不是某一次特别开心的时候。',
      options: [
        { text: '几乎每天，而且总能找到新话题', points: 3 },
        { text: '偶尔，但通常都有正事', points: 2 },
        { text: '很少，基本都是我先开口', points: 1 },
        { text: '从来不主动', points: 0 }
      ]
    },
    {
      part: 2,
      dimension: 'initiative',
      q: 'Ta会主动提出下一次见面吗？',
      hint: '注意是“主动提出”，不是你问了之后Ta答应。',
      options: [
        { text: '会，甚至会提前很久约', points: 3 },
        { text: '会，但通常会叫上共同朋友', points: 2 },
        { text: '我提的时候，Ta基本会答应', points: 1 },
        { text: '总是很忙，很难约', points: 0 }
      ]
    },
    {
      part: 2,
      dimension: 'attention',
      q: '你随口提过的小事，Ta会记得吗？',
      hint: '比如你不吃香菜、你怕冷、你提过的一部电影。',
      options: [
        { text: '经常记得，还会主动提起', points: 3 },
        { text: '有时候会记得', points: 2 },
        { text: '不太确定，可能只是刚好', points: 1 },
        { text: '基本不记得', points: 0 }
      ]
    },
    {
      part: 2,
      dimension: 'attention',
      q: '你状态不好时，Ta会发现吗？',
      hint: 'Ta有没有在你还没开口时，就看出你不对劲。',
      options: [
        { text: '很快发现，还会问你怎么了', points: 3 },
        { text: '看得出来，但不太会主动问', points: 2 },
        { text: '我表现得明显时才会', points: 1 },
        { text: '基本没发现过', points: 0 }
      ]
    },
    {
      part: 2,
      dimension: 'special',
      q: 'Ta对你的态度，和对别人一样吗？',
      hint: '不需要Ta对全世界宣布，只要你能感觉到那一点不同。',
      options: [
        { text: '明显不一样，我能感觉到偏爱', points: 3 },
        { text: '有时不一样，但我说不准', points: 2 },
        { text: '好像差不多', points: 1 },
        { text: '对别人反而更热情', points: 0 }
      ]
    },
    {
      part: 2,
      dimension: 'special',
      q: 'Ta会主动跟你分享私人的事吗？',
      hint: '那些不会随便告诉别人的情绪、家庭、过去。',
      options: [
        { text: '会，很多不会告诉别人的事', points: 3 },
        { text: '偶尔会，看Ta心情', points: 2 },
        { text: '基本只聊表面的事', points: 1 },
        { text: '从来不', points: 0 }
      ]
    },
    {
      part: 2,
      dimension: 'body',
      q: '见面时，Ta的身体会不自觉地朝向你吗？',
      hint: '脚尖、膝盖、肩膀，往往比嘴巴诚实。',
      options: [
        { text: '会，哪怕在人群里也会', points: 3 },
        { text: '有时候会', points: 2 },
        { text: '没注意过', points: 1 },
        { text: '会刻意保持距离', points: 0 }
      ]
    },
    {
      part: 2,
      dimension: 'body',
      q: '你和Ta对视时，Ta会？',
      hint: '想象最近一次，你们眼睛对上的瞬间。',
      options: [
        { text: '会停留几秒，甚至先笑', points: 3 },
        { text: '会看我，但很快移开', points: 2 },
        { text: '和看别人没什么不同', points: 1 },
        { text: '几乎不会和我对视', points: 0 }
      ]
    },
    {
      part: 2,
      dimension: 'emotion',
      q: '当你提到别人对你有好感时，Ta会？',
      hint: '不用说得太直接，只要看Ta那一瞬间的反应。',
      options: [
        { text: '明显在意，会追问或变得安静', points: 3 },
        { text: '开玩笑追问，语气有点酸', points: 2 },
        { text: '没什么反应', points: 1 },
        { text: '鼓励我试试', points: 0 }
      ]
    },
    {
      part: 2,
      dimension: 'emotion',
      q: 'Ta在你面前，会紧张或不自然吗？',
      hint: '摸头发、清嗓子、突然说错话，都算。',
      options: [
        { text: '经常会，比如摸头发、清嗓子、说错话', points: 3 },
        { text: '偶尔会', points: 2 },
        { text: '没注意过', points: 1 },
        { text: '一直很松弛，像对普通朋友', points: 0 }
      ]
    }
  ];

  const levels = [
    {
      min: 82,
      key: 'high',
      label: 'HIGH SIGNAL',
      title: 'Ta也在偷偷喜欢你。',
      sub: '信号已经很明显了，只差有人先开口。',
      line: '爱意有迹可循，这次不是你的错觉。',
      next: [
        '给Ta一个明确的台阶：直接约一次只有你们两个人的见面。',
        '把一句玩笑换成一句认真但不施加压力的表达。',
        '别把“确认关系”变成考试，给彼此留一点呼吸。'
      ]
    },
    {
      min: 68,
      key: 'warm',
      label: 'WARM SIGNAL',
      title: 'Ta对你有明显好感。',
      sub: 'Ta在靠近，但还在确认你是不是也认真。',
      line: '你们之间不是没有回响，只是还没对上同一个频率。',
      next: [
        '制造一次低压力独处，比如一起买咖啡、走一段路。',
        '观察Ta会不会主动延续下一次见面，而不是只享受当下。',
        '可以稍微减少一次秒回，看看Ta会不会来找你。'
      ]
    },
    {
      min: 54,
      key: 'mid',
      label: 'SIGNAL LOADING',
      title: 'Ta的心动，还在加载中。',
      sub: '有火花，但Ta还没决定要不要越界。',
      line: '有些喜欢不是没有，只是还没找到一个安全的出口。',
      next: [
        '先把线上暧昧落到线下，一次真实见面胜过一百条消息。',
        '试着直接表达一次小需求，看Ta愿不愿意为你调整。',
        '别急着定义关系，先确认Ta是否愿意为你花时间。'
      ]
    },
    {
      min: 40,
      key: 'low',
      label: 'UNSTABLE SIGNAL',
      title: 'Ta的心动信号，忽明忽暗。',
      sub: '别急着把礼貌当偏爱，也别急着否定自己。',
      line: '你需要的不是一个更聪明的猜测，而是一个更真实的回应。',
      next: [
        '把注意力收回到自己身上，别让Ta的每条动态决定你的情绪。',
        '用朋友的方式确认边界，先停止单方面加码。',
        '问自己：你喜欢的是Ta，还是你想象出来的Ta？'
      ]
    },
    {
      min: 26,
      key: 'faint',
      label: 'FAINT SIGNAL',
      title: 'Ta暂时把你放在朋友区。',
      sub: '不是你不值得，是Ta还没往那个方向想。',
      line: '喜欢不是考试，没有“再努力一点就能及格”。',
      next: [
        '先停止脑内小剧场，减少反复查看Ta动态的频率。',
        '给自己设一个期限：在这段时间里，不主动加码。',
        '把喜欢收回来一点，不是为了放弃，是为了看清。'
      ]
    },
    {
      min: 0,
      key: 'cold',
      label: 'LOW SIGNAL',
      title: '目前更像你一个人的电影。',
      sub: '这不丢人。暗恋本来就是一个人的兵荒马乱。',
      line: '你可以继续喜欢，但别忘了，你也是自己生活的主角。',
      next: [
        '不要用更多的付出去换一个不确定的答案。',
        '把“Ta今天有没有看我”换成“我今天有没有照顾好自己”。',
        '如果有一天你想说出口，可以，但不要为了一个结果去说。'
      ]
    }
  ];

  const partLabels = {
    1: {
      no: 'PART A',
      name: '你的暗恋侧写',
      en: 'SELF SCAN',
      hint: '先看看，你是怎么偷偷喜欢一个人的。'
    },
    2: {
      no: 'PART B',
      name: 'Ta的心动证据',
      en: "TA'S SIGNALS",
      hint: '现在，把镜头转向Ta。'
    }
  };

  const analysisLines = [
    '正在扫描Ta的心动信号',
    '比对 10 个关键细节',
    '寻找你们的频率交集',
    '正在生成心动回响'
  ];

  return {
    personaOrder,
    personas,
    dimensions,
    dimensionOrder,
    stages,
    questions,
    levels,
    partLabels,
    analysisLines
  };
})();
