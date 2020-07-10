$(document).ready(
    function() {        

        $("#datepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            onSelect: function(diaSelecionado) {
                programacao.busca(diaSelecionado);
            }
        });
    }
); 

var programacao = {
    btnver: function() {
        if ($("#datepicker").val()) {
            programacao.busca($("#datepicker").val());
        } else {
            $("#datepicker").trigger('select');
        }
    },

    busca: function(diaSelecionado) {
        $('#results').html('Aguarde...');

        var dia = diaSelecionado.substring(6, 10) + '-'
                + diaSelecionado.substring(3,5) + '-'
                + diaSelecionado.substring(0,2);
        
        $.ajax({
            url: 'http://localhost:8081/v1/programacao',
            data: {dia: dia},
            success: function(data, code) {                
                programacao.grade(data);
            },
            error: function(jqXHR, msg) {
                console.log('error: ' + msg);                
            },
            complete: function(jqXHR, msg) {
                if (jqXHR.status != 200) {
                    $('#results').html('Programação indisponível para esta data.');
                }
            }
        });
    },

    grade: function(data) {
        if ((!data) || (typeof data != 'object') ) {
            $('#results').html('Dados de programação não disponíveis.');
            return;
        }
        
        var now = Math.floor( ( Date.now() / 1000));
        var dateopt = {
            hour: 'numeric', 
            minute: 'numeric',
            hour12: false,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        var template = $('#template').html();
        var html = '';
        
        $.each(data.programme.entries, function(i, item) {
            let logo = item.custom_info.Graficos.LogoURL ?? 'https://s3.glbimg.com/v1/AUTH_947d0a0390ad47fbba7a4b93423e1004/Logo/76.jpg';
            let title = item.title;
            let desc = item.description;
            let itime = new Intl.DateTimeFormat('pt-BR', dateopt).format( new Date(item.start_time * 1000) );
            let etime = new Intl.DateTimeFormat('pt-BR', dateopt).format( new Date(item.end_time * 1000) );

            let card = template
                .replace('img src=""', 'img src="' + logo + '"')
                .replace('_TITLE_', title)
                .replace('_DESC_', desc)
                .replace('_ITIME_', itime)
                .replace('_ETIME_', etime);

            let tsitime = ( Number(item.start_time) );
            let tsetime = ( Number(item.end_time));
            if (tsitime <= now && tsetime >= now) {
                card = card.replace('_VIVO_', 'AO VIVO AGORA');
            } else {
                card = card.replace('_VIVO_', '');
            }

            html = html + card;
        });
        $('#results').html(html);
    }
}